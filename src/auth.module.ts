// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyGuard } from './guards/api/api-key.guard';
import { Reflector } from '@nestjs/core';

@Module({
  imports: [ConfigModule],
  providers: [ApiKeyGuard, Reflector],
  exports: [ApiKeyGuard, Reflector],
})
export class AuthModule {}
