import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RecommandationService {
  constructor(private readonly httpService: HttpService) {}

  async getRecomandation(
    track: string,
    artist: string,
    genres: string[],
    popularity: string,
  ) {
    let BASE_RECOMMENDATION_URL = 'https://api.spotify.com/v1/recommendations';

    const token =
      'BQDGZ81z15gntPucQe_efc-LJPZvjuIUknd_6h7xLi-YlXgtzj6YTRR3LeIbeDXJc_LVudHMtPZZNXmh7040z6U9a1J2exNoq9LrmIB5dfOtkpUsssYw';
    const headers = {
      Authorization: `Bearer ${token}`, // Add the bearer token to the Authorization header
    };

    if (track) {
      BASE_RECOMMENDATION_URL += `?tracks=${track}`;
    }
    if (artist) {
      BASE_RECOMMENDATION_URL += `?seed_artists=${artist}`;
    }

    if (genres && genres.length > 0) {
      const queryString = genres
        .map((genre) => `seed_genres=${encodeURIComponent(genre)}`)
        .join('&');
      BASE_RECOMMENDATION_URL += `?${queryString}`;
    }

    if (popularity) {
      const popularity2 = '100';
      BASE_RECOMMENDATION_URL += `?max_popularity=${popularity2}`;
    }
    return this.httpService.get(`${BASE_RECOMMENDATION_URL}`, { headers });
  }
}
