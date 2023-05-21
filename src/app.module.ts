import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { RecommendationsController } from './modules/recommendations/controllers/recommendation.getTracks.controller';

@Module({
  imports: [RecommendationsModule],
  controllers: [AppController, RecommendationsController],
  providers: [AppService],
})
export class AppModule {}
