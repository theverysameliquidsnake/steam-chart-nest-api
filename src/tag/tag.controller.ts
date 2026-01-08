import { Controller, Get, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private tagService: TagService) {}

    @Get()
    getAllTags() {
        return this.tagService.getAllTags();
    }

    @Post()
    createManyTags() {
        return this.tagService.createManyTags();
    }
}
