import { HttpService } from '@nestjs/axios';
import { Inject, HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { BasicTrackQuery, PopularityEnum } from './helpers/consts';
import {
  returnStringAsArray,
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

  async getRecommendationsWithoutIds(
    tracks: BasicTrackQuery[],
    artist: string,
    genres: string,
    popularity: string,
  ) {
    if (returnRecommendationParamsNumber(tracks, artist, genres) > 5) {
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

    if (genres) {
      RECOMMENDATION_URL += `&seed_genres=${encodeURIComponent(genres)}`;
    }
    if (tracks) {
      const trackIds = await Promise.all(
        tracks.map(
          async (trackItem) =>
            (
              await this.searchService.getTrack(
                trackItem.track,
                trackItem.artist,
              )
            ).id,
        ),
      );
      RECOMMENDATION_URL += `&seed_tracks=${trackIds.join(',')}`;
    }
    if (artist) {
      const artistIds = await Promise.all(
        returnStringAsArray(artist).map(
          async (albumItem) =>
            (
              await this.searchService.getArtistId(albumItem)
            ).id,
        ),
      );
      RECOMMENDATION_URL += `&seed_artists=${artistIds.join(',')}`;
    }

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

  async getRecommendations(
    tracks: string[],
    artists: string[],
    genres: string[],
    popularity: string,
  ) {
    //  in case there is only one item, it should convert to an array instead of a string
    const toArray = (value) => (typeof value === 'string' ? [value] : value);

    artists = toArray(artists);
    tracks = toArray(tracks);
    genres = toArray(genres);

    if (tracks?.length + genres?.length + artists?.length > 5) {
      throw new HttpException(
        'Combined length of track, artist, and genres should not exceed 5 items',
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = await this.cacheManager.get('spotify-auth-token');
    let RECOMMENDATION_URL = this.configService.get('BASE_RECOMMENDATION_URL');

    RECOMMENDATION_URL += `?max_popularity=${
      PopularityEnum[popularity]
    }&seed_genres=${genres?.join(',') || ''}&seed_tracks=${
      tracks?.join(',') || ''
    }&seed_artists=${artists?.join(',') || ''}`;

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
            artistId: recommendationItem.artists[0].id,
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
