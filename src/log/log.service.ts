import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogService extends ConsoleLogger {
    constructor(@InjectRepository(Log) private logRepository: Repository<Log>) {
        super();
    }

    async logToPostgres(
        level: string,
        message: string,
        details?: string,
        context?: string,
        relatedTo?: number,
    ): Promise<void> {
        const log = this.logRepository.create({
            level: level,
            message: message,
            details: details,
            context: context,
            relatedTo: relatedTo,
        });
        await this.logRepository.save(log);
    }
}
