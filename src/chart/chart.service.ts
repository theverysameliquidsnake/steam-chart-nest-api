import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamGame } from 'src/steam/entities/steam_details.entity';
import { Repository } from 'typeorm';
import { ChartData, ChartDataDto } from './dto/chart.dto';

@Injectable()
export class ChartService {
    constructor(@InjectRepository(SteamGame) private steamGameRepository: Repository<SteamGame>) {}

    async getChartData(tags?: string[]): Promise<ChartDataDto> {
        const chartDataWrapper = new ChartDataDto();

        const baseChartData = new ChartData();
        baseChartData.years = {};
        baseChartData.coming_soon = await this.steamGameRepository.count({ where: { isReleased: false } });
        const byYear: { year: number; count: string }[] = await this.steamGameRepository
            .createQueryBuilder('steam_game')
            .select('EXTRACT(YEAR FROM steam_game.release_date)::INTEGER', 'year')
            .addSelect('COUNT(steam_game.id)', 'count')
            .where('steam_game.release_date IS NOT NULL')
            .andWhere('steam_game.is_released = :isReleased', { isReleased: true })
            .groupBy('year')
            .orderBy('year', 'ASC')
            .getRawMany();
        byYear.forEach((stat) => {
            baseChartData.years[stat.year] = parseInt(stat.count);
        });
        chartDataWrapper.base = baseChartData;

        if (tags) {
            tags = tags.sort();
            if (tags.includes('AI')) {
                tags = tags.filter((tag) => {
                    return tag !== 'AI';
                });
                tags.unshift('AI');
            }
            chartDataWrapper.additional = {};
            for (const tag of tags) {
                if (tag === 'AI') {
                    const aiChartData = new ChartData();
                    aiChartData.years = {};
                    aiChartData.coming_soon = await this.steamGameRepository.count({
                        where: { isReleased: false, hasAi: true },
                    });
                    const byYear: { year: number; count: string }[] = await this.steamGameRepository
                        .createQueryBuilder('steam_game')
                        .select('EXTRACT(YEAR FROM steam_game.release_date)::INTEGER', 'year')
                        .addSelect('COUNT(steam_game.id)', 'count')
                        .where('steam_game.release_date IS NOT NULL')
                        .andWhere('steam_game.is_released = :isReleased', { isReleased: true })
                        .andWhere('steam_game.has_ai = :hasAi', { hasAi: true })
                        .groupBy('year')
                        .orderBy('year', 'ASC')
                        .getRawMany();
                    byYear.forEach((stat) => {
                        aiChartData.years[stat.year] = parseInt(stat.count);
                    });
                    chartDataWrapper.additional['AI'] = aiChartData;
                } else {
                    const tagChartData = new ChartData();
                    tagChartData.years = {};
                    tagChartData.coming_soon = await this.steamGameRepository
                        .createQueryBuilder('steam_game')
                        .innerJoin('steam_game.tags', 'tag')
                        .where('steam_game.is_released = :isReleased', { isReleased: false })
                        .andWhere('tag.name = :tagName', { tagName: tag })
                        .getCount();
                    const byYear: { year: number; count: string }[] = await this.steamGameRepository
                        .createQueryBuilder('steam_game')
                        .select('EXTRACT(YEAR FROM steam_game.release_date)::INTEGER', 'year')
                        .addSelect('COUNT(steam_game.id)', 'count')
                        .innerJoin('steam_game.tags', 'tag')
                        .where('steam_game.release_date IS NOT NULL')
                        .andWhere('steam_game.is_released = :isReleased', { isReleased: true })
                        .andWhere('tag.name = :tagName', { tagName: tag })
                        .groupBy('year')
                        .orderBy('year', 'ASC')
                        .getRawMany();
                    byYear.forEach((stat) => {
                        tagChartData.years[stat.year] = parseInt(stat.count);
                    });
                    chartDataWrapper.additional[tag] = tagChartData;
                }
            }
        }

        return chartDataWrapper;
    }
}
