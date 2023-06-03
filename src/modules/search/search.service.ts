import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class SearchService {
  private BASE_SEARCH_URL: string;
  constructor(private readonly httpService: HttpService) {
    this.BASE_SEARCH_URL = 'https://api.spotify.com/v1/search';
  }

  async getArtistId(artist: string) {
    const token =
      'BQCxs3RmFc2dzm3_yT6aAcbsakRM78HH9yJ-IW33Nno66X3f-1_z2bIzfYWEWKc3CcwCal1HTfbyqckwPyOLiPYnJujO7Bl6vWrQ705fDM4gq0VkCGo';

    const headers = {
      Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
    };
    const SPOTIFY_SEARCH_ARTIST_URL =
      this.BASE_SEARCH_URL + `?q=${encodeURIComponent(artist)}&type=artist`;

    try {
      const response = await this.httpService.axiosRef.get(
        SPOTIFY_SEARCH_ARTIST_URL,
        {
          headers,
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
    const BASE_SEARCH_URL = 'https://api.spotify.com/v1/search';
    const token =
      'BQCxs3RmFc2dzm3_yT6aAcbsakRM78HH9yJ-IW33Nno66X3f-1_z2bIzfYWEWKc3CcwCal1HTfbyqckwPyOLiPYnJujO7Bl6vWrQ705fDM4gq0VkCGo';

    const headers = {
      Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
    };
    const SPOTIFY_SEARCH_TRACK_URL =
      BASE_SEARCH_URL + `?q=${encodeURIComponent(track)}&type=track`;

    try {
      const response = await this.httpService.axiosRef.get(
        SPOTIFY_SEARCH_TRACK_URL,
        {
          headers,
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
