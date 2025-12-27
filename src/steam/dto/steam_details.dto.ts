import { IsBoolean, IsInt, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SteamAppDetailsDto {
    @IsBoolean()
    success: boolean;

    @IsObject()
    data: Data;
}

class Data {
    @IsInt()
    steam_appid: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsObject()
    release_date: ReleaseDate;
}

class ReleaseDate {
    @IsBoolean()
    coming_soon: boolean;

    @IsString()
    date: string;
}
