import { Controller, Get, Query } from '@nestjs/common';
import { RecommandationService } from '../recommendations.service';
@Controller('default-recommendations')
export class DefaultRecommendationsController {
  constructor(private readonly recommandationService: RecommandationService) {}

  @Get('/')
  async getDefaultRecommendations(
    @Query('tracks') tracks: string,
    @Query('artists') artists: string,
    @Query('genres') genres: string,
    @Query('popularity') popularity: string,
  ) {
    try {
      return this.recommandationService.getRecommendationsWithoutIds(
        JSON.parse(tracks),
        artists,
        genres,
        popularity,
      );
    } catch (e) {
      throw new Error(e);
    }
  }
}
