import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AccessTokenValidationService } from '../../services/access-token-validation.service';
import { Reflector } from '@nestjs/core';
import { PASS_ACCESS_TOKEN_CHECK_KEY } from '../../decorator/jwt/passAccessTokenCheck';

@Injectable()
export class AccessTokenAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenValidationService: AccessTokenValidationService,
  ) {}

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isPassAccessTokenAuth = this.reflector.get<boolean>(
      PASS_ACCESS_TOKEN_CHECK_KEY,
      context.getHandler(),
    );

    if (isPassAccessTokenAuth) {
      return true;
    }

    if (!token) {
      throw new UnauthorizedException('Bearer token is required');
    }

    try {
      const isValid =
        await this.accessTokenValidationService.validateToken(token);
      if (!isValid) {
        throw new UnauthorizedException(
          'Invalid token or token validation failed',
        );
      }
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid token or token validation failed',
      );
    }
    return true;
  }
}
