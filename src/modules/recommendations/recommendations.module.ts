import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RecommandationService } from './recommendations.service';
import { RecommendationsController } from './controllers/recommendation.getTracks.controller';
import { SearchService } from '../search/search.service';
import { CacheModule } from '@nestjs/cache-manager/dist';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [RecommendationsController],
  providers: [RecommandationService, SearchService],
})
export class RecommendationsModule {}
