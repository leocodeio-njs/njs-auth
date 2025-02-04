import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AccessTokenValidationService {
  private readonly logger = new Logger(AccessTokenValidationService.name);
  private accessTokenValidationUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.logger.log('AccessTokenValidationService constructor called');
    this.accessTokenValidationUrl = this.configService.get(
      'ACCESS_TOKEN_VALIDATION_URL',
    );
    this.logger.log(
      `Access token validation URL: ${this.accessTokenValidationUrl}`,
    );
  }

  async validateToken(token: string): Promise<boolean> {
    const validationPayload = {
      channel: 'api',
      clientId: this.configService.get('CLUSTER_CLIENT_ID'),
    };
    const validationResponse = await fetch(this.accessTokenValidationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'x-api-key': this.configService.get('AUTHORIZER_API_KEY'),
      },
      body: JSON.stringify(validationPayload),
    });
    const validationResponseData: any = await validationResponse.json();
    return validationResponseData?.data?.valid;
  }
}
