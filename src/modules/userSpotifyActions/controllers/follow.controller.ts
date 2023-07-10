import { Controller, Put, Delete, Headers, Body, Get } from '@nestjs/common';
import { UserSpotifyActionsService } from '../userSpotifyActions.service';
@Controller('user-actions')
export class FollowController {
  constructor(
    private readonly usersSpotifyActionsService: UserSpotifyActionsService,
  ) {}

  @Put('/follow-artist')
  async FollowArtistForUser(
    @Headers('decrypted') userId: string,
    @Body() user: { artistId: string },
  ) {
    try {
      return this.usersSpotifyActionsService.followArtist(
        userId,
        user.artistId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  @Delete('/unfollow-artist')
  async UnfollowArtistForUser(
    @Headers('decrypted') userId: string,
    @Body() user: { artistId: string },
  ) {
    try {
      return this.usersSpotifyActionsService.unfollowArtist(
        userId,
        user.artistId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  @Get('/get-followed-artists')
  async getSavedTracks(@Headers('decrypted') userId: string) {
    try {
      return this.usersSpotifyActionsService.getFollowedArtistsForUser(userId);
    } catch (err) {
      throw new Error(err);
    }
  }
}
