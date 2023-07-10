import {
  Body,
  Controller,
  Put,
  Delete,
  Param,
  Get,
  Headers,
  Req,
} from '@nestjs/common';
import { UserSpotifyActionsService } from '../userSpotifyActions.service';
@Controller('user-actions')
export class SaveTracksForUserController {
  constructor(
    private readonly usersSpotifyActionsService: UserSpotifyActionsService,
  ) {}

  @Get('/get-saved-tracks')
  async getSavedTracks(@Headers('decrypted') userId: string) {
    try {
      return this.usersSpotifyActionsService.getSavedTracksForUser(userId);
    } catch (err) {
      throw new Error(err);
    }
  }
  @Put('/save-track')
  async saveTrackForUser(
    @Headers('decrypted') userId: string,
    @Body() user: { trackId: string },
  ) {
    try {
      return this.usersSpotifyActionsService.saveTrack(user.trackId, userId);
    } catch (err) {
      throw new Error(err);
    }
  }

  @Delete('/unsave-track')
  async unsavetrackForUser(
    @Headers('decrypted') userId: string,

    @Body() user: { trackId: string },
  ) {
    try {
      return this.usersSpotifyActionsService.unsaveTrack(user.trackId, userId);
    } catch (err) {
      throw new Error(err);
    }
  }
}
