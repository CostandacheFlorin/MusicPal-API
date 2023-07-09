import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Playlist } from '../recommendations/helpers/consts';

@Injectable()
export class UserSpotifyActionsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}
  async saveTrack(trackId: string, userId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }

    const response = await this.httpService.axiosRef.put(
      `https://api.spotify.com/v1/me/tracks`,
      { ids: [trackId] }, // Provide the track IDs as an array in the request body
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return { success: true };
  }
  async unsaveTrack(trackId: string, userId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }

    const response = await this.httpService.axiosRef.delete(
      `https://api.spotify.com/v1/me/tracks`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        data: { ids: [trackId] }, // Provide the track IDs as an array in the request body
      },
    );
    return { success: true };
  }
  async addToPlaylist(trackId: string, userId: string, playlistId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }
    const response = await this.httpService.axiosRef.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: [`spotify:track:${trackId}`], // Provide the track URIs as an array in the request body
        position: 0, // Specify the position where the track should be added (optional)
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return { success: true };
  }

  async createPlaylist(
    userId: string,
    name: string,
    description: string,
    isPublic: boolean,
  ) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }
    const response = await this.httpService.axiosRef.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name,
        description,
        public: isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return { success: true };
  }

  async getPlaylists(userId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }
    const response = await this.httpService.axiosRef.get(
      `https://api.spotify.com/v1/users/${userId}/playlists?limit=50`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      },
    );

    const ownedPlaylists: Playlist[] = [];

    response.data.items.forEach((playlist) => {
      if (playlist.owner.id === userId) {
        const playlistInfo: Playlist = {
          name: playlist.name,
          id: playlist.id,
        };
        ownedPlaylists.push(playlistInfo);
      }
    });

    return ownedPlaylists;
  }

  async followArtist(userId: string, artistId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }

    const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${encodeURIComponent(
      artistId,
    )}`;
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json',
    };
    const data = {
      ids: [artistId],
    };

    try {
      const response = await this.httpService.axiosRef.put(url, data, {
        headers,
      });
      return { success: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async unfollowArtist(userId: string, artistId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }
    const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistId}`;
    const headers = {
      Authorization: `Bearer ${user.accessToken}`,
      'Content-Type': 'application/json',
    };
    const data = {
      ids: ['string'],
    };

    try {
      const response = await this.httpService.axiosRef.delete(url, {
        headers,
        data,
      });
      return { success: true };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getRecommandationsBasedOnLatestTracks() {}

  async getSavedTracksForUser(userId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }

    let offset = 0;
    let total = 10000; // Set an initial value that will be updated after the first request
    const savedTracks = [];

    while (offset < total) {
      const response = await this.httpService.axiosRef.get(
        `https://api.spotify.com/v1/me/tracks?limit=50&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      savedTracks.push(
        ...response.data.items.map((item) => {
          return { id: item.track.id, name: item.track.name };
        }),
      );

      total = response.data.total;
      offset += response.data.limit;
    }

    return savedTracks;
  }
  async getFollowedArtistsForUser(userId: string) {
    const user = await this.userService.getUserByUserId(userId);
    if (!user) {
      throw new HttpException("User doesn't exist!", 404);
    }

    let nextUrl = `https://api.spotify.com/v1/me/following?type=artist&limit=50`;
    const followedArtists = [];

    while (nextUrl) {
      const response = await this.httpService.axiosRef.get(nextUrl, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });

      followedArtists.push(
        ...response.data.artists.items.map((item) => {
          return { id: item.id, name: item.name };
        }),
      );

      nextUrl = response.data.artists.next;
    }

    return followedArtists;
  }
}
