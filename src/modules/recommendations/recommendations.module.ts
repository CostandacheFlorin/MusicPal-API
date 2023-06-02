import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecommandationService } from './recommendations.service';
import { RecommendationsController } from './controllers/recommendation.getTracks.controller';

@Module({
  imports: [HttpModule],
  controllers: [RecommendationsController],
  providers: [RecommandationService],
})
export class RecommendationsModule {}
