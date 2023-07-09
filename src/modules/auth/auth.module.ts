import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager/dist';
import { AuthService } from './auth.service';
import { AuthController } from './controllers/auth.controller';
@Module({
  imports: [HttpModule, CacheModule.register()],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
