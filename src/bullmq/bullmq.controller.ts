import { Controller, Get } from '@nestjs/common';
import { BullMQService } from './bullmq.service';

@Controller('queue')
export class BullMQController {
    constructor(private bullMQService: BullMQService) {}

    @Get()
    getAllScheduledJobs() {
        return this.bullMQService.getAllScheduledJobs();
    }
}
