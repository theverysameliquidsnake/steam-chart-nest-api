import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SteamCmdAppDetailsDto {
    @IsObject()
    data: Data;
}

class Data {
    @IsString()
    @IsNotEmpty()
    status: string;

    [id: number]: {
        common: Common;
    };
}

class Common {
    @IsObject()
    store_tags: Record<number, number>;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    aicontenttype?: string;
}
