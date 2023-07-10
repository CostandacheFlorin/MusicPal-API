import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager/dist';
import { UserSpotifyActionsService } from './userSpotifyActions.service';
import { UsersService } from '../users/users.service';
import { UserSchema } from '../../models/UserData.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SaveTracksForUserController } from './controllers/saveTracks.controller';
import { AddInPlaylistController } from './controllers/playlists.controller';
import { FollowController } from './controllers/follow.controller';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [
    SaveTracksForUserController,
    AddInPlaylistController,
    FollowController,
  ],
  providers: [UserSpotifyActionsService, UsersService],
})
export class UserSpotifyActionsModule {}
