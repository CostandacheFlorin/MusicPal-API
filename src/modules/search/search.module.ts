import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchService } from './search.service';
import { getArtistId } from './controllers/search.getArtistId.controller';
import { getTrackId } from './controllers/search.getTrackId.controller';
import { CacheModule } from '@nestjs/cache-manager/dist';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [getArtistId, getTrackId],
  providers: [SearchService],
})
export class SearchModule {}
