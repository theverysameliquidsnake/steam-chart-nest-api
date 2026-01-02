import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './entities/log.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogService extends ConsoleLogger {
    constructor(@InjectRepository(Log) private logRepository: Repository<Log>) {
        super();
    }

    async logToPostgres(level: string, message: string, relatedTo?: number, details?: string): Promise<void> {
        const log = this.logRepository.create({
            level: level,
            message: message,
            relatedTo: relatedTo,
            details: details,
        });
        await this.logRepository.save(log);
    }

    async getLatestLogs(): Promise<Log[]> {
        return this.logRepository.find({
            order: { createdAt: 'DESC' },
            take: 50,
        });
    }
}
