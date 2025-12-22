import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileDto } from './dto/file.dto';

@Injectable()
export class FileService {
    constructor(
        @InjectRepository(File) private fileRepository: Repository<File>,
    ) {}

    async uploadFile(fileDto: FileDto): Promise<File> {
        const file = new File();
        file.name = fileDto.name;
        file.content = fileDto.content;
        return this.fileRepository.save(file);
    }
}
