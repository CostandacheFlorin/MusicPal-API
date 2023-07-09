import { HttpService } from '@nestjs/axios';
import { Inject, HttpException, Injectable, HttpStatus } from '@nestjs/common';
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

    const response = await this.httpService.axiosRef.get(
      SPOTIFY_SEARCH_ARTIST_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
        },
      },
    );

    if (response.data.artists.items.length === 0) {
      throw new HttpException(
        'Could not find an artist with that name!',
        HttpStatus.NOT_FOUND,
      );
    }

    const artistInfo = response.data.artists.items[0];
    return {
      id: artistInfo.id,
      image: artistInfo.images[0].url,
      name: artistInfo.name,
    };
  }

  async getTrack(track: string, artist: string) {
    const token = await this.cacheManager.get('spotify-auth-token');
    const SPOTIFY_SEARCH_TRACK_URL =
      this.configService.get('BASE_SEARCH_URL') +
      `?q=track: ${encodeURIComponent(track)}+artist: ${encodeURIComponent(
        artist,
      )}&type=track`;

    const response = await this.httpService.axiosRef.get(
      SPOTIFY_SEARCH_TRACK_URL,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
        },
      },
    );
    if (response.data.tracks.items.length === 0) {
      throw new HttpException(
        'Could not find a track with that name!',
        HttpStatus.NOT_FOUND,
      );
    }
    const trackInfo = response.data.tracks.items[0];
    const artistNames = trackInfo.artists
      .map((artistItem) => artistItem.name)
      .join(', ');

    return {
      id: trackInfo.id,
      image: trackInfo.album.images[0].url,
      name: trackInfo.name,
      artists: artistNames,
    };
  }
}
