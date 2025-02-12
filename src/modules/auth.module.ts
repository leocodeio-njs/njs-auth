// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

// Guards
import { ApiKeyGuard } from '../auth/guards/api/api-key.guard';
import { RolesGuard } from '../auth/guards/auth/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt/acess-token-auth.strategy.guard';
import { IpRateLimitGuard } from '../auth/guards/rate-limit/rate-limit.guard';

//decorators
import { PassAccessTokenCheck } from '../auth/decorator/jwt/passAccessTokenCheck';
import { Roles } from '../auth/decorator/auth/roles.decorator';
import { Public } from '../auth/decorator/api/public.decorator';

// services
import { AuthService } from './auth.service';
import { UserRepository } from '../modules/user/domain/ports/user.repository';
import { OTPRepository } from '../modules/otp/domain/ports/otp.repository';
import { SessionRepository } from '../modules/session/domain/ports/session.repository';
import { SmsService } from '../auth/services/sms.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ApiKeyGuard,
    Reflector,
    RolesGuard,
    IpRateLimitGuard,
    AuthService,

  ],
  exports: [
    ApiKeyGuard,
    Reflector,
    RolesGuard,
    IpRateLimitGuard,
    AuthService,
  ],
})
export class AuthModule {}
