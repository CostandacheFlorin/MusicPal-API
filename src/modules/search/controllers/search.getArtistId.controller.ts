import { Controller, Get, Headers, HttpException, Param } from '@nestjs/common';
import { SearchService } from '../search.service';

@Controller('search')
export class getArtistId {
  constructor(private readonly searchService: SearchService) {}

  @Get('/artist/by-name/:artistName')
  async getArtistId(@Param('artistName') artistName: string) {
    try {
      return this.searchService.getArtistId(artistName);
    } catch (e) {
      throw new Error(e);
    }
  }
}
