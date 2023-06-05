import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GetSpotifyTokenController } from './controllers/utils.getSpotifyAuthToken.controller';
import { UtilsService } from './utils.service';
import { CacheModule } from '@nestjs/cache-manager/dist';
import { GetMusicGenresController } from './controllers/utils.getSpotifyGenres.controller';

@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [GetSpotifyTokenController, GetMusicGenresController],
  providers: [UtilsService],
})
export class UtilsModule {}
