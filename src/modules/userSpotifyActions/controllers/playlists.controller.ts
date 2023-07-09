import { Body, Controller, Put, Post, Get, Param } from '@nestjs/common';
import { UserSpotifyActionsService } from '../userSpotifyActions.service';
@Controller('user-actions')
export class AddInPlaylistController {
  constructor(
    private readonly usersSpotifyActionsService: UserSpotifyActionsService,
  ) {}

  @Get('/get-playlists/:userId')
  async getPlaylistsForUser(@Param('userId') userId: string) {
    return this.usersSpotifyActionsService.getPlaylists(userId);
  }

  @Put('/save-in-playlist')
  async saveInPlaylist(
    @Body() data: { trackId: string; userId: string; playlistId: string },
  ) {
    try {
      return this.usersSpotifyActionsService.addToPlaylist(
        data.trackId,
        data.userId,
        data.playlistId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('/create-playlist')
  async createPlaylist(
    @Body()
    data: {
      userId: string;
      name: string;
      description: string;
      isPublic: boolean;
    },
  ) {
    try {
      return this.usersSpotifyActionsService.createPlaylist(
        data.userId,
        data.name,
        data.description,
        data.isPublic,
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
