// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

// Guards
import { ApiKeyGuard } from '../auth/guards/api/api-key.guard';
import { RolesGuard } from '../auth/guards/auth/roles.guard';
import { ExternalJwtGuard } from '../auth/guards/jwt/external-jwt.guard';

//decorators
import { PassAccessTokenCheck } from '../auth/decorator/jwt/passAccessTokenCheck';
import { Roles } from '../auth/decorator/auth/roles.decorator';
import { Public } from '../auth/decorator/api/public.decorator';

// services
import { TokenValidationService } from '../auth/services/token-validation.service';

@Module({
  imports: [ConfigModule],
  providers: [
    ApiKeyGuard,
    Reflector,
    RolesGuard,
    ExternalJwtGuard,
    TokenValidationService,
  ],
  exports: [
    ApiKeyGuard,
    Reflector,
    RolesGuard,
    ExternalJwtGuard,
    TokenValidationService,
  ],
})
export class AuthModule {}
