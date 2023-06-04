import { IsString, IsOptional } from 'class-validator';

export class recommendationDto {
  @IsOptional()
  @IsString()
  track: string;

  @IsOptional()
  @IsString()
  artist: string;

  @IsOptional()
  @IsString()
  genres: string;
}
