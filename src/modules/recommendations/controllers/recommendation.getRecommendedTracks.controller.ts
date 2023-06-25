import { Controller, Get, Query } from '@nestjs/common';
import { RecommandationService } from '../recommendations.service';
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommandationService: RecommandationService) {}

  @Get('/')
  async getRecommendations(
    @Query('tracks') tracks: string[],
    @Query('artists') artists: string[],
    @Query('genres') genres: string[],
    @Query('popularity') popularity: string,
  ) {
    try {
      return this.recommandationService.getRecommendations(
        tracks,
        artists,
        genres,
        popularity,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
