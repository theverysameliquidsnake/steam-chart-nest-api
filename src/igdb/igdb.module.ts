import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullMQModule } from 'src/bullmq/bullmq.module';
import { IgdbGame } from './entities/igdb_game.entity';
import { IgdbExternalGame } from './entities/igdb_external_game.entity';
import { IgdbService } from './igdb.service';
import { IgdbController } from './igdb.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([IgdbGame, IgdbExternalGame]),
        HttpModule,
        BullMQModule,
    ],
    controllers: [IgdbController],
    providers: [IgdbService],
})
export class IgdbModule {}
