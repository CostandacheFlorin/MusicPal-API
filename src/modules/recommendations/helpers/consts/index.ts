export enum PopularityEnum {
  high = '100',
  medium = '66',
  low = '33',
}

export const OneDayInMS = 86400000;

export interface BasicTrackQuery {
  track: string;
  artist: string;
}
