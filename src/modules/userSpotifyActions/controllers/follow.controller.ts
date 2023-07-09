import { Controller, Put, Delete, Param, Body, Get } from '@nestjs/common';
import { UserSpotifyActionsService } from '../userSpotifyActions.service';
@Controller('user-actions')
export class FollowController {
  constructor(
    private readonly usersSpotifyActionsService: UserSpotifyActionsService,
  ) {}

  @Put('/follow-artist')
  async FollowArtistForUser(
    @Body() user: { artistId: string; userId: string },
  ) {
    return this.usersSpotifyActionsService.followArtist(
      user.userId,
      user.artistId,
    );
  }

  @Delete('/unfollow-artist')
  async UnfollowArtistForUser(
    @Body() user: { artistId: string; userId: string },
  ) {
    return this.usersSpotifyActionsService.unfollowArtist(
      user.userId,
      user.artistId,
    );
  }

  @Get('/get-followed-artists/:userId')
  async getSavedTracks(@Param('userId') userId: string) {
    return this.usersSpotifyActionsService.getFollowedArtistsForUser(userId);
  }
}
