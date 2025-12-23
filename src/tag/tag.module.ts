import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { ValkeyModule } from 'src/valkey/valkey.module';
import { TagService } from './tag.service';
import { FileModule } from 'src/file/file.module';
import { TagController } from './tag.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Tag]), ValkeyModule, FileModule],
    controllers: [TagController],
    providers: [TagService],
})
export class TagModule {}
