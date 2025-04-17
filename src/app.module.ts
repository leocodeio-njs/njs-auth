import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule, AppConfigService } from '@leocodeio-njs/njs-config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Load environment variables - update with the path to your .env file
      envFilePath: ['.env.local', '.env'],
      // Add social media configuration variables
      validationSchema: Joi.object({
        // Existing validation

        // APP PORT
        PORT: Joi.number().default(3000).required(),

        // DATABASE CONFIGURATION
        DB_HOST: Joi.string().default('localhost').required(),
        DB_USERNAME: Joi.string().default('postgres').required(),
        DB_PASSWORD: Joi.string().default('postgres').required(),
        DB_DATABASE: Joi.string().default('postgres').required(),
        DB_SCHEMA: Joi.string().default('test').required(),
        DB_PORT: Joi.number().default(5432).required(),

        //rate limit
        RATE_LIMIT_POINTS: Joi.number().default(100).required(),
        RATE_LIMIT_DURATION: Joi.number()
          .default(60 * 60)
          .required(), // Per hour
        RATE_LIMIT_BLOCK_DURATION: Joi.number()
          .default(5 * 60)
          .required(), // 5min block if exceeded

        // guards
        // apikey guard
        APP_KEY: Joi.string().default('apikey').required(),
        // acess token guard
        ACCESS_TOKEN_VALIDATION_URL: Joi.string()
          .default('http://localhost:3000/validate')
          .required(),
        AUTHORIZER_API_KEY: Joi.string().default('validkey1').required(),
        CLUSTER_CLIENT_ID: Joi.string().default('validclient1').required(),
      }),
    }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        ...configService.databaseConfig,
        entities: [],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
