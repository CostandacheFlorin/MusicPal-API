import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AES, enc } from 'crypto-js';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class DecryptionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Get the encrypted parameter from the request
    const encryptedParam = req.headers.authorization;
    // Decrypt the parameter
    const decryptedParam = AES.decrypt(
      encryptedParam,
      this.configService.get('ENCRYPT_KEY'),
    ).toString(enc.Utf8);
    // Set the decrypted parameter back to the request object
    req.headers.decrypted = decryptedParam;
    next();
  }
}
