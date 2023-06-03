import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SearchService } from './search.service';
import { getArtistId } from './controllers/search.getArtistId.controller';
import { getTrackId } from './controllers/search.getTrackId.controller';

@Module({
  imports: [HttpModule],
  controllers: [getArtistId, getTrackId],
  providers: [SearchService],
})
export class SearchModule {}
