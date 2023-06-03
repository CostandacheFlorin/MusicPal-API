import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [RecommendationsModule, SearchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
