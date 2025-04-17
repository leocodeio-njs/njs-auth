import { CorrelationService, LoggerService } from '@leocodeio-njs/njs-logging';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from '../types/token';

@Injectable()
export class TokenManagementService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly correlationService: CorrelationService,
  ) {
    this.logger.setLogContext('TokenManagementService');
  }

  /**
   * Generate an access token for a user
   */
  async decodeActualToken(token: string): Promise<TokenPayload> {
    this.logger.debug('Decoding and verifying origin token', {
      token,
    });

    const decoded = this.decodeAndVerifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    return decoded;
  }

  /**
   * Generate an access token for a user
   */
  async generateOriginBaseAccessToken(
    token: string,
    baseUrl: string,
    baseMethod: string,
  ): Promise<string> {
    const decoded = this.decodeAndVerifyToken(token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload: TokenPayload = {
      ...decoded,
      baseUrl: baseUrl,
      baseMethod: baseMethod,
    };

    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  /**
   * Decode and verify a JWT token
   */
  decodeAndVerifyToken(token: string): any {
    try {
      this.logger.debug('Decoding and verifying token', {
        token,
      });
      const secret = this.configService.get('JWT_SECRET');
      this.logger.debug('Verifying token', {
        token,
        secret,
      });
      const decoded = this.jwtService.verify(token, { secret });
      this.logger.log('Token verified', {
        token,
        decoded,
      });
      return decoded;
    } catch (error: any) {
      this.logger.error(`Token verification failed: ${error.message}`, {
        correlationId: this.correlationService.getCorrelationId(),
      });
      throw new UnauthorizedException(
        error.name === 'TokenExpiredError'
          ? 'Token has expired'
          : 'Invalid token',
      );
    }
  }
}
