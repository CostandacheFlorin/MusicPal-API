import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users.service';
import { User } from '../../../models/UserData.schema';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/create')
  async createUser(@Body() user: User) {
    try {
      return this.usersService.createUser(user);
    } catch (err) {
      throw new Error(err);
    }
  }
}
