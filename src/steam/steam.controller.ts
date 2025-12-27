import { Controller, Post } from '@nestjs/common';
import { SteamService } from './steam.service';

@Controller('steam')
export class SteamController {
    constructor(private steamService: SteamService) {}

    @Post()
    triggerJobs() {
        return this.steamService.triggerJobs();
    }
}
