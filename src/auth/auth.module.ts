// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { LoggerService, LoggingModule } from '@leocodeio-njs/njs-logging';

// Guards
import { ApiKeyGuard } from '../auth/guards/api/api-key.guard';
import { AccessTokenGuard } from './guards/auth/access-token.guard';
import { IpRateLimitGuard } from '../auth/guards/rate-limit/rate-limit.guard';

// Services
import { AccessTokenValidationService } from './services/access-token-validation.service';
import { TokenManagementService } from './services/token-management.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    LoggingModule.forRoot({
      winston: {
        console: true,
      },
    }),
  ],
  providers: [
    LoggerService,
    // Services
    AccessTokenValidationService,
    TokenManagementService,

    // Guards
    ApiKeyGuard,
    AccessTokenGuard,
    IpRateLimitGuard,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: IpRateLimitGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
  exports: [
    // Services
    AccessTokenValidationService,
    TokenManagementService,
    // Guards
    ApiKeyGuard,
    AccessTokenGuard,
    IpRateLimitGuard,
  ],
})
export class AuthModule {}
