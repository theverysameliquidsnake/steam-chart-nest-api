import { Controller, Get, Param, Post } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
    constructor(private tagService: TagService) {}

    @Get(':id')
    getOneTag(@Param('id') id: number) {
        return this.tagService.getOneTag(id);
    }

    @Get()
    getAllTags() {
        return this.tagService.getAllTags();
    }

    @Post()
    createManyTags() {
        return this.tagService.createManyTags();
    }
}
