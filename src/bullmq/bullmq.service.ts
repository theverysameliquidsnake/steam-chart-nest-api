import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bullmq';

@Injectable()
export class BullMQService {
    constructor(@InjectQueue('steam-queue') private steamQueue: Queue) {}

    async getAllScheduledJobs(): Promise<Job[]> {
        return this.steamQueue.getWaiting();
    }
}
