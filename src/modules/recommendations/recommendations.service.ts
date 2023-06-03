import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { SearchService } from '../search/search.service';

@Injectable()
export class RecommandationService {
  constructor(
    private readonly httpService: HttpService,
    private readonly searchService: SearchService,
  ) {}

  async getRecomandation(
    track: string,
    artist: string,
    genres: string,
    popularity: string,
  ) {
    const BASE_RECOMMENDATION_URL =
      'https://api.spotify.com/v1/recommendations';
    const token =
      'BQCxs3RmFc2dzm3_yT6aAcbsakRM78HH9yJ-IW33Nno66X3f-1_z2bIzfYWEWKc3CcwCal1HTfbyqckwPyOLiPYnJujO7Bl6vWrQ705fDM4gq0VkCGo';
    const headers = {
      Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
    };

    let RECOMMENDATION_URL = BASE_RECOMMENDATION_URL.slice();
    if (track) {
      const trackId = await this.searchService.getTrackId(track);
      RECOMMENDATION_URL += `?seed_tracks=${trackId}`;
    }
    if (artist) {
      const artistId = await this.searchService.getArtistId(artist);
      RECOMMENDATION_URL += `&seed_artists=${artistId}`;
    }

    if (genres && genres.length > 0) {
      const genresAsArray = genres
        .split(',')
        .map((id) => encodeURIComponent(id));
      const joinedGenres = genresAsArray.join(',');
      RECOMMENDATION_URL += `&seed_genres=${joinedGenres}`;
    }

    if (popularity) {
      const popularity2 = '100';
      RECOMMENDATION_URL += `&max_popularity=${popularity2}`;
    }
    try {
      const response = await this.httpService.axiosRef.get(RECOMMENDATION_URL, {
        headers,
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
