import { HttpService } from '@nestjs/axios';
import { Inject, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class SearchService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getArtistId(artist: string) {
    const token = await this.cacheManager.get('spotify-auth-token');

    const SPOTIFY_SEARCH_ARTIST_URL =
      this.configService.get('BASE_SEARCH_URL') +
      `?q=${encodeURIComponent(artist)}&type=artist`;

    try {
      const response = await this.httpService.axiosRef.get(
        SPOTIFY_SEARCH_ARTIST_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
          },
        },
      );

      const artistId = response.data.artists.items[0].id;
      return artistId;
    } catch (error) {
      throw new HttpException(
        error.response.data.error.message,
        error.response.data.error.status,
      );
    }
  }

  async getTrackId(track: string) {
    const token = await this.cacheManager.get('spotify-auth-token');
    const SPOTIFY_SEARCH_TRACK_URL =
      this.configService.get('BASE_SEARCH_URL') +
      `?q=${encodeURIComponent(track)}&type=track`;

    try {
      const response = await this.httpService.axiosRef.get(
        SPOTIFY_SEARCH_TRACK_URL,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
          },
        },
      );
      const trackId = response.data.tracks.items[0].id;
      return trackId;
    } catch (error) {
      throw new HttpException(
        error.response.data.error.message,
        error.response.data.error.status,
      );
    }
  }
}
