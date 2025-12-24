import { Controller } from '@nestjs/common';
import { IgdbService } from './igdb.service';

@Controller('igdb')
export class IgdbController {
    constructor(private igdbService: IgdbService) {}
}
