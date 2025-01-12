import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api/api-key.guard';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
