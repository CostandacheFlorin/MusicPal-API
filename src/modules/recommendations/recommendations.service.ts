import { BadRequestException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MerchantSkinsService {
  async createDefaultSkin() {
    console.log('respect');
  }
}
