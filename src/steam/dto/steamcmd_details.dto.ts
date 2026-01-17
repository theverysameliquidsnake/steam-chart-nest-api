import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class SteamCmdAppDetailsDto {
    @IsObject()
    data: Data;

    @IsString()
    @IsNotEmpty()
    status: string;
}

class Data {
    [id: number]: {
        appid: string;
        common: Common;
    };
}

class Common {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsObject()
    store_tags: Record<number, number>;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    aicontenttype?: string;

    @IsString()
    steam_release_date?: string;

    @IsString()
    original_release_date?: string;
}
