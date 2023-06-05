import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../search.service';

@Controller('search')
export class getTrackId {
  constructor(private readonly searchService: SearchService) {}

  @Get('/track')
  async getTrackInfo(
    @Query('track') track: string,
    @Query('artist') artist: string,
  ) {
    try {
      console.log(track);
      console.log(artist);

      return this.searchService.getTrack(track, artist);
    } catch (e) {
      throw new Error(e);
    }
  }
}
