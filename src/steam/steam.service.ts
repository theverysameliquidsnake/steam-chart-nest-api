import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { SteamAppListDto } from './dto/steam_list.dto';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, retry } from 'rxjs';
import { AxiosError } from 'axios';
import { SteamAppDetailsDto } from './dto/steam_details.dto';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SteamGame } from './entities/steam_details.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamCmdAppDetailsDto } from './dto/steamcmd_details.dto';
import { Tag } from 'src/tag/entities/tag.entity';
import { SteamParentJobData } from './interfaces/steam_parent_job_data.interface';
import { LogService } from 'src/log/log.service';
import { SocksProxyAgent } from 'socks-proxy-agent';

@Injectable()
export class SteamService {
    constructor(
        private configService: ConfigService,
        private httpService: HttpService,
        @InjectRepository(SteamGame) private steamGameRepository: Repository<SteamGame>,
        @InjectQueue('steam-queue') private steamQueue: Queue,
        private logger: LogService,
    ) {
        this.logger.setContext('SteamService');
    }

    async getBatchAppIds(lastAppId?: number): Promise<SteamAppListDto> {
        await this.logger.logToPostgres('info', `Trying to get list of apps (last id: ${lastAppId})`);
        let appIdListEndpoint = `https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${this.configService.get('STEAM_API_KEY')}`;
        if (lastAppId) {
            appIdListEndpoint += `&last_appid=${lastAppId}`;
        }
        const { data } = await firstValueFrom(
            this.httpService.get<SteamAppListDto>(appIdListEndpoint).pipe(
                retry({ count: 5, delay: 5000 }),
                catchError(async (error: AxiosError) => {
                    console.error(error);
                    await this.logger.logToPostgres('error', `Error getting list of apps (last id: ${lastAppId})`);
                    throw new Error(`Could not obtain steam app list: ${lastAppId ? lastAppId : -1}`);
                }),
            ),
        );
        await this.logger.logToPostgres('info', `Got list of apps (last id: ${lastAppId})`);
        return data;
    }

    async getAppDetails(appId: number): Promise<SteamAppDetailsDto> {
        await this.logger.logToPostgres('info', `Trying to get app details from Steam`, appId);
        const appDetailsEndpoint = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
        const proxyAgent = new SocksProxyAgent(this.configService.get('PROXY_URL', 'socks5h://127.0.0.1:9050'));
        const { data } = await firstValueFrom(
            this.httpService
                .get<Record<number, SteamAppDetailsDto>>(appDetailsEndpoint, {
                    httpsAgent: proxyAgent,
                    httpAgent: proxyAgent,
                })
                .pipe(
                    retry({ count: 5, delay: 5000 }),
                    catchError(async (error: AxiosError) => {
                        console.error(error);
                        await this.logger.logToPostgres(
                            'error',
                            `Error getting app details from Steam`,
                            appId,
                            JSON.stringify(error),
                        );
                        throw new Error(`Could not obtain steam app details: ${appId}`);
                    }),
                ),
        );
        await this.logger.logToPostgres('info', `Got app details from Steam`, appId);
        return data[appId];
    }

    async getAppDetailsFromCmd(appId: number): Promise<SteamCmdAppDetailsDto> {
        await this.logger.logToPostgres('info', `Trying to get app details from SteamCMD`, appId);
        const appDetailsEndpoint = `https://api.steamcmd.net/v1/info/${appId}`;
        const { data } = await firstValueFrom(
            this.httpService.get<SteamCmdAppDetailsDto>(appDetailsEndpoint).pipe(
                retry({ count: 5, delay: 5000 }),
                catchError(async (error: AxiosError) => {
                    console.error(error);
                    await this.logger.logToPostgres(
                        'error',
                        `Error getting app details from SteamCMD`,
                        appId,
                        JSON.stringify(error),
                    );
                    throw new Error(`Could not obtain steamcmd app details: ${appId}`);
                }),
            ),
        );
        await this.logger.logToPostgres('info', `Got app details from SteamCMD`, appId);
        return data;
    }

    async createSteamGame(appId: number): Promise<void> {
        try {
            const steamGame = this.steamGameRepository.create({});
            const steamAppDetails = await this.getAppDetails(appId);
            if (steamAppDetails.success) {
                steamGame.id = steamAppDetails.data.steam_appid;
                steamGame.name = steamAppDetails.data.name;
                if (!steamAppDetails.data.release_date.coming_soon) {
                    steamGame.isReleased = true;
                    steamGame.releaseDate = new Date(steamAppDetails.data.release_date.date);
                } else {
                    steamGame.isReleased = false;
                }

                const steamCmdAppDetails = await this.getAppDetailsFromCmd(appId);
                if (steamCmdAppDetails.status === 'success') {
                    if (steamCmdAppDetails.data[appId].common?.aicontenttype) {
                        steamGame.hasAi = true;
                    }
                    if (steamCmdAppDetails.data[appId].common?.store_tags) {
                        const tags: Tag[] = [];
                        for (const tagId of Object.values(steamCmdAppDetails.data[appId].common.store_tags)) {
                            const tag = new Tag();
                            tag.id = tagId;
                            tags.push(tag);
                        }
                        if (tags.length > 0) {
                            steamGame.tags = tags;
                        }
                    }
                } else {
                    await this.logger.logToPostgres(
                        'error',
                        `Unexpected response from SteamCMD`,
                        appId,
                        JSON.stringify(steamCmdAppDetails),
                    );
                }

                /** TODO: Add falback to SteamCMD if Steam request failed */
                await this.steamGameRepository.save(steamGame);
            } else {
                await this.logger.logToPostgres(
                    'error',
                    `Unexpected response from Steam`,
                    appId,
                    JSON.stringify(steamAppDetails),
                );
            }
        } catch (error) {
            await this.logger.logToPostgres('error', `Unexpected error`, appId, JSON.stringify(error));
        }
    }

    async getLastInsertedSteamAppId(): Promise<number | undefined> {
        const latestSteamGameInserted: SteamGame[] = await this.steamGameRepository.find({
            order: { id: 'DESC' },
            take: 1,
        });

        return latestSteamGameInserted.length > 0 ? latestSteamGameInserted[0].id : undefined;
    }

    async triggerJobs() {
        await this.steamQueue.add('get-apps-list', {
            lastAppId: await this.getLastInsertedSteamAppId(),
        } as SteamParentJobData);
    }
}
