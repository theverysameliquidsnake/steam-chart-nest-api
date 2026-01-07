import { IsNumber, IsObject } from 'class-validator';

export class ChartDataDto {
    base: ChartData;

    additional: Record<string, ChartData>;
}

export class ChartData {
    @IsObject()
    years: Record<number, number>;

    @IsNumber()
    coming_soon: number;

    @IsNumber()
    unknown: number;
}
