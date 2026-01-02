import { BullModule, BullRootModuleOptions } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BullMQController } from './bullmq.controller';
import { BullMQService } from './bullmq.service';

@Module({
    imports: [
        BullModule.forRootAsync({
            useFactory: (configService: ConfigService): BullRootModuleOptions => ({
                connection: {
                    host: configService.get<string>('VALKEY_HOST', 'localhost'),
                    port: configService.get<number>('VALKEY_PORT', 6379),
                },
                defaultJobOptions: {
                    removeOnComplete: 100,
                    removeOnFail: 1000,
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({ name: 'steam-queue' }),
    ],
    controllers: [BullMQController],
    providers: [BullMQService],
    exports: [BullModule],
})
export class BullMQModule {}
