import { Controller, Get, Headers, Param } from '@nestjs/common';
import { RecommandationService } from '../recommendations.service';
@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly recommandationService: RecommandationService) {}

  @Get('/')
  async getRecommendations() {
    try {
      return this.recommandationService.getRecomandation(
        null,
        null,
        ['classical', 'country'],
        'high',
      );
    } catch (e) {
      const message = e.message;
    }
  }
}
