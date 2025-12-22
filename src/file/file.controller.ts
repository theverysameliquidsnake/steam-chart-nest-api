import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from './dto/file.dto';

@Controller('files')
export class FileController {
    constructor(private fileService: FileService) {}

    @Post('tags')
    @UseInterceptors(FileInterceptor('file'))
    uploadFile(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 250 * 1024 }),
                    new FileTypeValidator({
                        fileType: 'text/html',
                        fallbackToMimetype: true,
                    }),
                ],
            }),
        )
        file: Express.Multer.File,
    ) {
        const fileDto = new FileDto();
        fileDto.name = file.originalname;
        fileDto.content = file.buffer.toString();
        return this.fileService.uploadFile(fileDto);
    }
}
