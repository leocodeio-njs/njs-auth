import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { CanActivate } from '@nestjs/common';
import { TokenValidationService } from '../../services/token-validation.service';
import { Reflector } from '@nestjs/core';
import { PASS_ACCESS_TOKEN_CHECK_KEY } from '../../decorator/jwt/passAccessTokenCheck';

@Injectable()
export class ExternalJwtGuard implements CanActivate {
  constructor(
    private tokenValidationService: TokenValidationService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    const passAccessTokenCheck = this.reflector.get<boolean>(
      PASS_ACCESS_TOKEN_CHECK_KEY,
      context.getHandler(),
    );

    if (isPublic || passAccessTokenCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const access_token = request.headers['access_token'];
    
    if (!access_token) {
      throw new UnauthorizedException('Bearer access token is required');
    }

    try {
      const isTokenValid: boolean =
        await this.tokenValidationService.validateToken(access_token);
      console.log('ExternalJwtGuard - isTokenValid:', isTokenValid); // Debug log 1
      return isTokenValid;
    } catch (error) {
      console.error('ExternalJwtGuard - Error:', error); // Debug log 3
      throw new UnauthorizedException(
        'Invalid token or token validation failed',
      );
    }
  }
}
