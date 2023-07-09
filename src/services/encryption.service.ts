import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { promisify } from 'util';

@Injectable()
export class EncryptionUtil {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: string;

  private readonly ivLength = 32;
  constructor(private readonly configService: ConfigService) {
    this.key = this.configService.get('ENCRYPT_KEY');
  }

  private readonly generateIv = promisify(randomBytes);

  async encryptData(data: string): Promise<string> {
    const iv = await this.generateIv(this.ivLength);
    const cipher = createCipheriv(this.algorithm, this.key, iv);

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedData = `${iv.toString('hex')}:${encrypted}`;
    return encryptedData;
  }

  decryptData(encryptedData: string): string {
    const [ivString, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivString, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.key, iv);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
