import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IgdbGameDto {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    external_games?: ExternalGame[];
}

class ExternalGame {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    uid: string;

    @IsNotEmpty()
    external_game_source: ExternalGameSource;

    @IsInt()
    @IsNotEmpty()
    game: number;
}

class ExternalGameSource {
    @IsInt()
    @IsNotEmpty()
    id: number;

    @IsString()
    @IsNotEmpty()
    name: string;
}
