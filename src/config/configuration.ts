export default () => ({
  BASE_SEARCH_URL: process.env.BASE_SEARCH_URL,
  BASE_RECOMMENDATION_URL: process.env.BASE_RECOMMENDATION_URL,
  SPOTIFY_GRANT_TYPE: process.env.SPOTIFY_GRANT_TYPE,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_GET_TOKEN_URL: process.env.SPOTIFY_GET_TOKEN_URL,
  SPOTIFY_GET_GENRES_URL: process.env.SPOTIFY_GET_GENRES_URL,
  SPOTIFY_REDIRECT_URL: process.env.SPOTIFY_REDIRECT_URL,
  SPOTIFY_REDIRECT_SUCCESS: process.env.SPOTIFY_REDIRECT_SUCCESS,
  SPOTIFY_REDIRECT_FAIL: process.env.SPOTIFY_REDIRECT_FAIL,
  SPOTIFY_GET_PROFILE_INFO: process.env.SPOTIFY_GET_PROFILE_INFO,
  SPOTIFY_PERMISSION_NOT_GRANTED: process.env.SPOTIFY_PERMISSION_NOT_GRANTED,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  MONGO_DATABASE: process.env.MONGO_DATABASE,
  ENCRYPT_KEY: process.env.ENCRYPT_KEY,
});
