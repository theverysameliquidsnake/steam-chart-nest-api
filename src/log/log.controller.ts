import { Controller, Get } from '@nestjs/common';
import { LogService } from './log.service';

@Controller('log')
export class LogController {
    constructor(private logService: LogService) {}

    @Get()
    getLatestLogs() {
        return this.logService.getLatestLogs();
    }
}
