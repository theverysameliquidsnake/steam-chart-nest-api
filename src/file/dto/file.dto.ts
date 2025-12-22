import { IsNotEmpty, IsString } from 'class-validator';

export class FileDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
