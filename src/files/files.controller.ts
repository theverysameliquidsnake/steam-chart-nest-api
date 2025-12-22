import {
    Controller,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
    constructor(private filesService: FilesService) {}

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
        return this.filesService.uploadFile(file.buffer.toString());
    }
}
