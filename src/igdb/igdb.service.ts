import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { IgdbGame } from './entities/igdb_game.entity';
import { Repository } from 'typeorm';
import { IgdbExternalGame } from './entities/igdb_external_game.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class IgdbService {
    constructor(
        @InjectRepository(IgdbGame)
        private igdbGameRepository: Repository<IgdbGame>,
        @InjectRepository(IgdbExternalGame)
        private igdbExternalGameRepository: Repository<IgdbExternalGame>,
        private configService: ConfigService,
        private httpService: HttpService,
        @InjectQueue('steam-api') private steamApiQueue: Queue,
    ) {}

    async getAccessToken(): Promise<string> {
        const tokenEndpoin = `https://id.twitch.tv/oauth2/token?client_id=${this.configService.get('IGDB_CLIENT_ID')}&client_secret=${this.configService.get('IGDB_CLIENT_SECRET')}&grant_type=client_credentials`;
        const { data } = await firstValueFrom(
            this.httpService.post<{ access_token: string }>(tokenEndpoin).pipe(
                catchError((error: AxiosError) => {
                    console.error(error);
                    throw new Error('Could not obtain token');
                }),
            ),
        );
        return data.access_token;
    }
}
