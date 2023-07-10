import { Controller, Get } from '@nestjs/common';
import { UtilsService } from '../utils.service';
@Controller('utils')
export class GetMusicGenresController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('/genres')
  async getMusicGenres() {
    try {
      return this.utilsService.getAllMusicGenres();
    } catch (err) {
      throw new Error(err);
    }
  }

  @Get('/check-api-health')
  checkHealth() {
    return { status: 'OK' };
  }
}
