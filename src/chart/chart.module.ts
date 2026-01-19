import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SteamGame } from 'src/steam/entities/steam_details.entity';
import { ChartController } from './chart.controller';
import { ChartService } from './chart.service';
import { ValkeyModule } from 'src/valkey/valkey.module';

@Module({
    imports: [TypeOrmModule.forFeature([SteamGame]), ValkeyModule],
    controllers: [ChartController],
    providers: [ChartService],
})
export class ChartModule {}
