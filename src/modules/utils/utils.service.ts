import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OneDayInMS } from '../recommendations/helpers/consts';
import { UsersService } from '../users/users.service';
import { User } from '../../models/UserData.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UtilsService implements OnModuleInit {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectModel('User') private readonly userModel: Model<User>,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  onModuleInit() {
    this.getSpotifyToken();
    this.refreshAllUsersTokens();
  }
  @Cron(CronExpression.EVERY_30_MINUTES)
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

  async refreshUserToken(user: User) {
    const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get('SPOTIFY_CLIENT_SECRET');

    try {
      const response = await this.httpService.axiosRef.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(
              `${clientId}:${clientSecret}`,
            ).toString('base64')}`,
          },
        },
      );
      const { access_token: accessToken, refresh_token: newRefreshToken } =
        response.data;

      const newUser = new this.userModel({
        userId: user.userId,
        refreshToken: user.refreshToken,
        accessToken: accessToken,
      });

      this.usersService.updateUser(newUser);
      return {
        accessToken,
        refreshToken: newRefreshToken, // Optional, depending on whether the refresh token was rotated
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async refreshAllUsersTokens() {
    const users = await this.usersService.getUsers();
    for (const user of users) {
      this.refreshUserToken(user);
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
