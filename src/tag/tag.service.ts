import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { FileService } from 'src/file/file.service';
import * as cheerio from 'cheerio';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag) private tagRepository: Repository<Tag>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private fileService: FileService,
    ) {}

    async getAllTags(): Promise<Tag[]> {
        const cachedTags = await this.cacheManager.get<string>('tags');
        if (cachedTags) {
            return JSON.parse(cachedTags) as Tag[];
        }

        const tags = await this.tagRepository.find({ order: { name: 'ASC' } });
        if (tags.length > 0) {
            await this.cacheManager.set('tags', JSON.stringify(tags));
        }

        return tags;
    }

    async createManyTags(): Promise<Tag[]> {
        const file = await this.fileService.getLatestFile();
        if (!file) {
            return [];
        }
        const $ = cheerio.load(file.content);
        const tagMap = new Map<number, string>();
        $('div.label > a').each((index, element) => {
            const tagIdString = $(element).attr('href')?.split('/')[2];
            const tagName = $(element).contents().last().text().trim();
            if (tagIdString) {
                tagMap.set(parseInt(tagIdString), tagName);
            }
        });
        const tagToInsert: Tag[] = [];
        for (const [key, value] of tagMap) {
            const tag = this.tagRepository.create({
                id: key,
                name: value,
            });
            tagToInsert.push(tag);
        }
        return this.tagRepository.save(tagToInsert);
    }
}
