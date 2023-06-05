import { BasicTrackQuery } from '../consts';

export const returnRecommendationParamsNumber = (
  track: BasicTrackQuery[],
  artist: string,
  genres: string,
) => {
  let itemsCount = 0;

  if (track) {
    itemsCount += track.length;
  }
  if (artist) {
    itemsCount++;
  }
  if (genres) {
    const genresCount = genres.split(',').length;
    itemsCount += genresCount;
  }

  return itemsCount;
};

export const returnStringAsArray = (string) => {
  const asArray = string.split(',').map((item) => encodeURIComponent(item));
  return asArray;
};
