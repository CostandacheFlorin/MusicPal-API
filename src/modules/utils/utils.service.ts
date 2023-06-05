import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron } from '@nestjs/schedule';
import { OneDayInMS } from '../recommendations/helpers/consts';

@Injectable()
export class UtilsService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  onModuleInit() {
    this.getSpotifyToken();
  }
  @Cron('0 0/55 * * * *')
  async getSpotifyToken() {
    const cachedToken = await this.cacheManager.get('spotify-auth-token');
    if (cachedToken) {
      return cachedToken;
    }

    const requestBody = {
      grant_type: this.configService.get('SPOTIFY_GRANT_TYPE'),
      client_id: this.configService.get('SPOTIFY_CLIENT_ID'),
      client_secret: this.configService.get('SPOTIFY_CLIENT_SECRET'),
    };
    try {
      const response = await this.httpService.axiosRef.post(
        this.configService.get('SPOTIFY_GET_TOKEN_URL'),
        requestBody,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      await this.cacheManager.set(
        'spotify-auth-token',
        response.data.access_token,
        3400000,
      );

      return { success: true };
    } catch (err) {
      throw new Error(err);
    }
  }

  async getAllMusicGenres() {
    const cachedGenres = await this.cacheManager.get('music-genres');
    if (cachedGenres) {
      return cachedGenres;
    }
    const token = await this.cacheManager.get('spotify-auth-token');
    const response = await this.httpService.axiosRef.get(
      this.configService.get('SPOTIFY_GET_GENRES_URL'),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    await this.cacheManager.set(
      'music-genres',
      response.data.genres,
      OneDayInMS,
    );
    return response.data.genres;
  }
}
