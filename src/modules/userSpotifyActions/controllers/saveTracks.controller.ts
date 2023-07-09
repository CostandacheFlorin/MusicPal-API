import { Body, Controller, Put, Delete, Param, Get } from '@nestjs/common';
import { UserSpotifyActionsService } from '../userSpotifyActions.service';
@Controller('user-actions')
export class SaveTracksForUserController {
  constructor(
    private readonly usersSpotifyActionsService: UserSpotifyActionsService,
  ) {}

  @Get('/get-saved-tracks/:userId')
  async getSavedTracks(@Param('userId') userId: string) {
    return this.usersSpotifyActionsService.getSavedTracksForUser(userId);
  }
  @Put('/save-track')
  async saveTrackForUser(@Body() user: { trackId: string; userId: string }) {
    try {
      return this.usersSpotifyActionsService.saveTrack(
        user.trackId,
        user.userId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  @Delete('/unsave-track')
  async unsavetrackForUser(@Body() user: { trackId: string; userId: string }) {
    try {
      return this.usersSpotifyActionsService.unsaveTrack(
        user.trackId,
        user.userId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
