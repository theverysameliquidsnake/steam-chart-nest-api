import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamGame } from 'src/steam/entities/steam_details.entity';
import { Repository } from 'typeorm';
import { ChartData, ChartDataDto } from './dto/chart.dto';

@Injectable()
export class ChartService {
    constructor(@InjectRepository(SteamGame) private steamGameRepository: Repository<SteamGame>) {}

    async getChartData(): Promise<ChartDataDto> {
        const chartDataWrapper = new ChartDataDto();

        const baseChartData = new ChartData();
        baseChartData.coming_soon = await this.steamGameRepository.count({ where: { isReleased: false } });
        const byYear: { year: number; count: string }[] = await this.steamGameRepository
            .createQueryBuilder('steam_game')
            .select('EXTRACT(YEAR FROM steam_game.release_date)::INTEGER', 'year')
            .where('steam_game.release_date IS NOT NULL')
            .addSelect('COUNT(steam_game.id)', 'count')
            .groupBy('year')
            .orderBy('year', 'ASC')
            .getRawMany();
        baseChartData.years = {};
        byYear.forEach((stat) => {
            baseChartData.years[stat.year] = parseInt(stat.count);
        });

        chartDataWrapper.base = baseChartData;
        return chartDataWrapper;
    }
}
