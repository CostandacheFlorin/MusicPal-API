import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../search.service';

@Controller('search')
export class getTrackId {
  constructor(private readonly searchService: SearchService) {}

  @Get('/track')
  async getArtistId(
    @Query('track') track: string,
    @Query('artist') artist: string,
  ) {
    try {
      return this.searchService.getTrackId(track, artist);
    } catch (e) {
      throw new Error(e);
    }
  }
}
