import { Controller, Get } from '@nestjs/common';
import { UtilsService } from '../utils.service';
@Controller('utils')
export class GetSpotifyTokenController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('/token')
  async getSpotifyToken() {
    try {
      return this.utilsService.getSpotifyToken();
    } catch (err) {
      throw new Error(err);
    }
  }

  // @Get('/refresh-users-tokens')
  // async refreshUsersTokens() {
  //   try {
  //     return this.utilsService.refreshAllUsersTokens();
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // }
}
