import { Controller, Get, Headers, Param } from '@nestjs/common';

@Controller('skin')
export class MerchantGetSingleSkinController {
  constructor() {}
  @Get('/:skinId')
  async getMerchantSkinById(@Param('skinId') skinId: string) {
    try {
    } catch (e) {
      const message = e.message;
    }
  }
}
