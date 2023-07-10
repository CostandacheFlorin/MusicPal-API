import { Body, Controller, Put, Post, Get, Headers } from '@nestjs/common';
import { UserSpotifyActionsService } from '../userSpotifyActions.service';
@Controller('user-actions')
export class AddInPlaylistController {
  constructor(
    private readonly usersSpotifyActionsService: UserSpotifyActionsService,
  ) {}

  @Get('/get-playlists')
  async getPlaylistsForUser(@Headers('decrypted') userId: string) {
    try {
      return this.usersSpotifyActionsService.getPlaylists(userId);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  }

  @Put('/save-in-playlist')
  async saveInPlaylist(
    @Headers('decrypted') userId: string,
    @Body('data') data: { trackId: string; playlistId: string },
  ) {
    try {
      return this.usersSpotifyActionsService.addToPlaylist(
        data.trackId,
        userId,
        data.playlistId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  @Post('/create-playlist')
  async createPlaylist(
    @Headers('decrypted') userId: string,
    @Body('data')
    playlistData: {
      name: string;
      description: string;
      isPublic: boolean;
    },
  ) {
    try {
      const { name, description, isPublic } = playlistData;
      console.log(isPublic);
      return this.usersSpotifyActionsService.createPlaylist(
        userId,
        name,
        description,
        !isPublic,
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
