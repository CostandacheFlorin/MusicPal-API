import { HttpService } from '@nestjs/axios';
import { Inject, HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PopularityEnum } from './helpers/consts';
import {
  returnGenresAsArray,
  returnRecommendationParamsNumber,
} from './helpers/utils';

@Injectable()
export class RecommandationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly searchService: SearchService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getRecomandation(
    track: string,
    artist: string,
    genres: string,
    popularity: string,
  ) {
    if (returnRecommendationParamsNumber(track, artist, genres) > 5) {
      throw new HttpException(
        'Combined length of track, artist, and genres should not exceed 5 items',
        HttpStatus.BAD_REQUEST,
      );
    }
    const token = await this.cacheManager.get('spotify-auth-token');

    let RECOMMENDATION_URL = this.configService
      .get('BASE_RECOMMENDATION_URL')
      .slice();

    RECOMMENDATION_URL += `?max_popularity=${PopularityEnum[popularity]}`;

    if (genres && genres.length > 0) {
      RECOMMENDATION_URL += `&seed_genres=${returnGenresAsArray(genres)}`;
    }
    if (track) {
      const trackId = await this.searchService.getTrackId(track);
      RECOMMENDATION_URL += `&seed_tracks=${trackId}`;
    }
    if (artist) {
      const artistId = await this.searchService.getArtistId(artist);
      RECOMMENDATION_URL += `&seed_artists=${artistId}`;
    }

    console.log(RECOMMENDATION_URL);
    try {
      const response = await this.httpService.axiosRef.get(RECOMMENDATION_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
        },
      });
      const rightTracks = response.data.tracks.map((recommendationItem) => {
        if (recommendationItem.type === 'track') {
          return {
            id: recommendationItem.id,
            name: recommendationItem.name,
            release_date: recommendationItem.album.release_date,
            image: recommendationItem.album.images[0].url,
            artists: recommendationItem.artists
              .map((artist) => artist.name)
              .join(', '),
          };
        }
      });
      return rightTracks;
    } catch (error) {
      throw new HttpException(
        error.response.data.error.message,
        error.response.data.error.status,
      );
    }
  }
}
