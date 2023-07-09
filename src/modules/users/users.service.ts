import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../models/UserData.schema';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(user: User): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async getUserByUserId(userId: string): Promise<User> {
    return this.userModel.findOne({ userId }).exec();
  }
  async getUsers() {
    return this.userModel.find().exec();
  }
  async updateUser(user: User): Promise<User> {
    const { userId, accessToken, refreshToken } = user;

    return this.userModel
      .findOneAndUpdate({ userId }, { accessToken, refreshToken })
      .exec();
  }
}
