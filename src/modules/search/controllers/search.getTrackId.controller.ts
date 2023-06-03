import { Controller, Get, Headers, Param } from '@nestjs/common';
import { SearchService } from '../search.service';

@Controller('search')
export class getTrackId {
  constructor(private readonly searchService: SearchService) {}

  @Get('/track/by-name/:trackName')
  async getArtistId(@Param('trackName') trackName: string) {
    try {
      return this.searchService.getTrackId(trackName);
    } catch (e) {
      throw new Error(e);
    }
  }
}
