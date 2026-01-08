import { Controller, Get, ParseArrayPipe, Query } from '@nestjs/common';
import { ChartService } from './chart.service';

@Controller('chart')
export class ChartController {
    constructor(private chartService: ChartService) {}

    @Get()
    getChartData(
        @Query('tags', new ParseArrayPipe({ items: String, separator: ',', optional: true })) tags?: string[],
    ) {
        return this.chartService.getChartData(tags);
    }
}
