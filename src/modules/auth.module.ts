// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

// Guards
import { ApiKeyGuard } from '../auth/guards/api/api-key.guard';
import { RolesGuard } from '../auth/guards/auth/roles.guard';
import { AccessTokenAuthGuard } from '../auth/guards/jwt/acess-token-auth.guard';
import { IpRateLimitGuard } from '../auth/guards/rate-limit/rate-limit.guard';

//decorators
import { PassAccessTokenCheck } from '../auth/decorator/jwt/passAccessTokenCheck';
import { Roles } from '../auth/decorator/auth/roles.decorator';
import { Public } from '../auth/decorator/api/public.decorator';

// services
import { AccessTokenValidationService } from '../auth/services/access-token-validation.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ApiKeyGuard,
    Reflector,
    RolesGuard,
    AccessTokenAuthGuard,
    IpRateLimitGuard,
    AccessTokenValidationService,
  ],
  exports: [
    ApiKeyGuard,
    Reflector,
    RolesGuard,
    AccessTokenAuthGuard,
    IpRateLimitGuard,
    AccessTokenValidationService,
  ],
})
export class AuthModule {}
