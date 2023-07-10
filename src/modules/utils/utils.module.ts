import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GetSpotifyTokenController } from './controllers/utils.getSpotifyAuthToken.controller';
import { UtilsService } from './utils.service';
import { CacheModule } from '@nestjs/cache-manager/dist';
import { GetMusicGenresController } from './controllers/utils.getSpotifyGenres.controller';
import { UserSpotifyActionsService } from '../userSpotifyActions/userSpotifyActions.service';
import { UserSchema } from '../../models/UserData.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [GetSpotifyTokenController, GetMusicGenresController],
  providers: [UtilsService, UserSpotifyActionsService, UsersService],
})
export class UtilsModule {}
