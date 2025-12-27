import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { SteamService } from './steam.service';
import { SteamParentJobData } from './interfaces/steam_parent_job_data.interface';
import { SteamAppListDto } from './dto/steam_list.dto';
import { SteamChildJobData } from './interfaces/steam_child_job_data.interface';

@Processor('steam-queue', { limiter: { max: 200, duration: 300000 } })
export class SteamWorker extends WorkerHost {
    constructor(
        private steamService: SteamService,
        @InjectQueue('steam-queue') private steamQueue: Queue,
    ) {
        super();
    }

    process(job: Job): Promise<void> {
        switch (job.name) {
            case 'get-apps-list':
                return this.getAppsList(job);
            case 'get-app-details':
                return this.getAppDetails(job);
            default:
                throw new Error(`Unknown job name ${job.name}`);
        }
    }

    async getAppsList(job: Job): Promise<void> {
        const parentJobData = job.data as SteamParentJobData;
        const steamAppList: SteamAppListDto = await this.steamService.getBatchAppIds(parentJobData?.lastAppId);
        const appDetailsJobs = steamAppList.response.apps.map((app) => ({
            name: 'get-app-details',
            data: { appId: app.appid } as SteamChildJobData,
        }));
        await this.steamQueue.addBulk(appDetailsJobs);
        if (steamAppList?.response.have_more_results) {
            await this.steamQueue.add('get-apps-list', {
                lastAppId: steamAppList.response.last_appid,
            } as SteamParentJobData);
        }
    }

    async getAppDetails(job: Job): Promise<void> {
        const childJobData = job.data as SteamChildJobData;
        await this.steamService.createSteamGame(childJobData.appId, true);
    }
}
