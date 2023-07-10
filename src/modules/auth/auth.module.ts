import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager/dist';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from '../users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionUtil } from '../../services/encryption.service';
import { UserSchema } from '../../models/UserData.schema';
@Module({
  imports: [
    HttpModule,
    CacheModule.register(),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, EncryptionUtil],
})
export class AuthModule {}
