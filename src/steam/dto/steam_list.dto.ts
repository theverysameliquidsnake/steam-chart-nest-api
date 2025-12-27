import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SteamAppListDto {
    response: Response;
}

class Response {
    @IsArray()
    apps: App[];

    @IsBoolean()
    @IsOptional()
    have_more_results?: boolean;

    @IsInt()
    @IsOptional()
    last_appid?: number;
}

class App {
    @IsInt()
    @IsNotEmpty()
    appid: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    @IsNotEmpty()
    last_modified: number;
}
