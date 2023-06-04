import { Controller, Get, Query } from '@nestjs/common';
import { RecommandationService } from '../recommendations.service';
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommandationService: RecommandationService) {}

  @Get('/')
  async getRecommendations(
    @Query('track') track: string,
    @Query('artist') artist: string,
    @Query('genres') genres: string,
    @Query('popularity') popularity: string,
  ) {
    try {
      return this.recommandationService.getRecomandation(
        track,
        artist,
        genres,
        popularity,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
