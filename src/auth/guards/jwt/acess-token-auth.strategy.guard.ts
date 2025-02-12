import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PASS_ACCESS_TOKEN_CHECK_KEY } from '../../decorator/jwt/passAccessTokenCheck';
import { SessionRepository } from '../../../modules/session/domain/ports/session.repository';


// passport jwt auth guard
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('SESSION_REPOSITORY') private sessionRepository: SessionRepository,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  canActivate(context: ExecutionContext) {
    const isPassAccessTokenCheck = this.reflector.getAllAndOverride<boolean>(
      PASS_ACCESS_TOKEN_CHECK_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPassAccessTokenCheck) {
      return true;
    }
    return super.canActivate(context);
  }

  async validate(payload: any) {
    const isValidSession = await this.sessionRepository.isValid(
      payload.sessionId,
    );
    // TODO: Implement session validation requesting to the session service
    // const isValidSession = true;
    if (!isValidSession) {
      throw new UnauthorizedException('Session expired');
    }

    return {
      id: payload.sub,
      email: payload.email,
      sessionId: payload.sessionId,
    };
  }
}
