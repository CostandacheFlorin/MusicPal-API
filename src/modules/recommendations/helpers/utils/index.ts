export const returnRecommendationParamsNumber = (
  track: string,
  artist: string,
  genres: string,
) => {
  let itemsCount = 0;

  if (track) {
    itemsCount++;
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

export const returnGenresAsArray = (genres) => {
  const genresAsArray = genres.split(',').map((id) => encodeURIComponent(id));
  return genresAsArray.join(',');
};
