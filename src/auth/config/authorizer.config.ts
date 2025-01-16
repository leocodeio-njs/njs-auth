import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizerConfig {
  private readonly configService: ConfigService;
  constructor() {}

  getAuthorizerConfig() {
    const config = {
      url: this.configService.get('AUTHORIZER_URL'),
      xapiKey: this.configService.get('AUTHORIZER_API_KEY'),
    };
    return config;
  }
}
