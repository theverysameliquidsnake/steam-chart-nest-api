import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SteamController } from './steam.controller';
import { SteamService } from './steam.service';
import { BullMQModule } from 'src/bullmq/bullmq.module';
import { SteamWorker } from './steam.worker';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SteamGame } from './entities/steam_details.entity';
import { LogModule } from 'src/log/log.module';

@Module({
    imports: [TypeOrmModule.forFeature([SteamGame]), BullMQModule, HttpModule, LogModule],
    controllers: [SteamController],
    providers: [SteamService, SteamWorker],
})
export class SteamModule {}
