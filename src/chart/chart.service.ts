import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SteamGame } from 'src/steam/entities/steam_details.entity';
import { Repository } from 'typeorm';
import { ChartData, ChartDataDto } from './dto/chart.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ChartService {
    constructor(
        @InjectRepository(SteamGame) private steamGameRepository: Repository<SteamGame>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    async getChartData(tags?: string[]): Promise<ChartDataDto> {
        const chartDataWrapper = new ChartDataDto();

        let baseChartData = new ChartData();
        const cachedbaseChartData = await this.cacheManager.get<string>('tags:none');
        if (cachedbaseChartData) {
            baseChartData = JSON.parse(cachedbaseChartData) as ChartData;
        } else {
            baseChartData = await this.queryBaseData();
            await this.cacheManager.set('tags:none', JSON.stringify(baseChartData), 5 * 60 * 1000);
        }
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
                    let aiChartData = new ChartData();
                    const cachedAiChartData = await this.cacheManager.get<string>('tags:AI');
                    if (cachedAiChartData) {
                        aiChartData = JSON.parse(cachedAiChartData) as ChartData;
                    } else {
                        aiChartData = await this.queryAiAdditionalData();
                        await this.cacheManager.set('tags:AI', JSON.stringify(aiChartData), 5 * 60 * 1000);
                    }
                    chartDataWrapper.additional['AI'] = aiChartData;
                } else {
                    let tagChartData = new ChartData();
                    const cachedTagChartData = await this.cacheManager.get<string>(`tags:${tag}`);
                    if (cachedTagChartData) {
                        tagChartData = JSON.parse(cachedTagChartData) as ChartData;
                    } else {
                        tagChartData = await this.queryAdditionalTagData(tag);
                        await this.cacheManager.set(`tags:${tag}`, JSON.stringify(tagChartData), 5 * 60 * 1000);
                    }
                    chartDataWrapper.additional[tag] = tagChartData;
                }
            }
        }

        return chartDataWrapper;
    }

    private async queryBaseData(): Promise<ChartData> {
        const baseChartData = new ChartData();
        baseChartData.years = {};
        // eslint-disable-next-line prettier/prettier
        baseChartData.coming_soon = await this.steamGameRepository
            .createQueryBuilder('steam_game')
            .where('steam_game.release_date IS NULL')
            .getCount();
        const byYear: { year: number; count: string }[] = await this.steamGameRepository
            .createQueryBuilder('steam_game')
            .select('EXTRACT(YEAR FROM steam_game.release_date)::INTEGER', 'year')
            .addSelect('COUNT(steam_game.id)', 'count')
            .where('steam_game.release_date IS NOT NULL')
            //.andWhere('steam_game.is_released = :isReleased', { isReleased: true })
            .groupBy('year')
            .orderBy('year', 'ASC')
            .getRawMany();
        byYear.forEach((stat) => {
            baseChartData.years[stat.year] = parseInt(stat.count);
        });
        return baseChartData;
    }

    private async queryAiAdditionalData(): Promise<ChartData> {
        const aiChartData = new ChartData();
        aiChartData.years = {};
        // eslint-disable-next-line prettier/prettier
        aiChartData.coming_soon = await this.steamGameRepository
            .createQueryBuilder('steam_game')
            .where('steam_game.release_date IS NULL')
            .andWhere('steam_game.has_ai = :hasAi', { hasAi: true })
            .getCount();
        const byYear: { year: number; count: string }[] = await this.steamGameRepository
            .createQueryBuilder('steam_game')
            .select('EXTRACT(YEAR FROM steam_game.release_date)::INTEGER', 'year')
            .addSelect('COUNT(steam_game.id)', 'count')
            .where('steam_game.release_date IS NOT NULL')
            //.andWhere('steam_game.is_released = :isReleased', { isReleased: true })
            .andWhere('steam_game.has_ai = :hasAi', { hasAi: true })
            .groupBy('year')
            .orderBy('year', 'ASC')
            .getRawMany();
        byYear.forEach((stat) => {
            aiChartData.years[stat.year] = parseInt(stat.count);
        });
        return aiChartData;
    }

    private async queryAdditionalTagData(tag: string): Promise<ChartData> {
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
        return tagChartData;
    }
}
