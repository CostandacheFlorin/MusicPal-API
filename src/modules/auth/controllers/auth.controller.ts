import { HttpService } from '@nestjs/axios';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from '../../../models/UserData.schema';
import { UsersService } from 'src/modules/users/users.service';
import { EncryptionUtil } from '../../../services/encryption.service';
import { AES, enc } from 'crypto-js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly encryptionUtil: EncryptionUtil,
  ) {}

  @Get('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
    const redirectUri = this.configService.get('SPOTIFY_REDIRECT_URL');
    const scopes =
      'playlist-read-private playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-recently-played user-top-read user-read-playback-position user-library-read user-library-modify';

    const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scopes)}`;

    res.redirect(spotifyAuthUrl);
  }

  @Get('/callback')
  async callback(@Req() req: Request, @Res() res: Response) {
    const { code, error } = req.query;
    if (error === 'access_denied') {
      // Handle the case where the user denied access to their Spotify account
      res.redirect(this.configService.get('SPOTIFY_PERMISSION_NOT_GRANTED'));
      return;
    }

    const clientId = this.configService.get('SPOTIFY_CLIENT_ID');
    const clientSecret = this.configService.get('SPOTIFY_CLIENT_SECRET');
    const redirectUri = this.configService.get('SPOTIFY_REDIRECT_URL');

    try {
      const tokenResponse = await this.httpService.axiosRef.post(
        this.configService.get('SPOTIFY_GET_TOKEN_URL'),
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: redirectUri,
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

      const { access_token: accessToken, refresh_token: refreshToken } =
        tokenResponse.data;

      // Save the access token and refresh token to the user's session or database

      const userProfileResponse = await this.httpService.axiosRef.get(
        this.configService.get('SPOTIFY_GET_PROFILE_INFO'),
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const spotifyId = userProfileResponse.data.id;

      const existingUser = await this.usersService.getUserByUserId(spotifyId);

      if (!existingUser) {
        const newUser = new this.userModel({
          userId: spotifyId,
          accessToken,
          refreshToken,
        });

        await newUser.save();
      }
      // const encryptedData = AES.encrypt(
      //   spotifyId,
      //   this.configService.get('ENCRYPT_KEY'),
      // ).toString();

      // Redirect the user to a success page or perform any other necessary actions
      res.redirect(
        `${this.configService.get(
          'SPOTIFY_REDIRECT_SUCCESS',
        )}?data=${spotifyId}`,
      );
    } catch (error) {
      console.error('Error exchanging authorization code for tokens:', error);

      // Redirect the user to an error page or perform any other necessary actions
      res.redirect(this.configService.get('SPOTIFY_REDIRECT_FAIL'));
    }
  }
}
