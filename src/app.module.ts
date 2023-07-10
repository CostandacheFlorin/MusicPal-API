import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { SearchModule } from './modules/search/search.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/configuration';
import { UtilsModule } from './modules/utils/utils.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { UserSpotifyActionsModule } from './modules/userSpotifyActions/userSpotifyActions.module';
import { DecryptionMiddleware } from './middlewares/decryption.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    CacheModule.register(),
    ScheduleModule.forRoot(),
    RecommendationsModule,
    SearchModule,
    UtilsModule,
    AuthModule,
    UsersModule,
    UserSpotifyActionsModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Import ConfigModule for the ConfigService
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get(
          'MONGO_USERNAME',
        )}:${configService.get(
          'MONGO_PASSWORD',
        )}@cluster0.hfygy.mongodb.net/${configService.get(
          'MONGO_DATABASE',
        )}?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService], // Inject ConfigService
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const routes = [
      'user-actions/follow-artist',
      'user-actions/unfollow-artist',
      'user-actions/get-followed-artists',
      'user-actions/get-playlists',
      'user-actions/save-in-playlist',
      'user-actions/create-playlist',
      'user-actions/get-saved-tracks',
      'user-actions/save-track',
      'user-actions/unsave-track',
    ];
    consumer.apply(DecryptionMiddleware).forRoutes(...routes);
    // Add more routes as needed
  }
}
