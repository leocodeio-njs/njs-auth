import { AuthModule } from './modules/auth.module';
import { Public } from './auth/decorator/api/public.decorator';
import { ApiKeyGuard } from './auth/guards/api/api-key.guard';
import { RolesGuard } from './auth/guards/auth/roles.guard';
import { Roles } from './auth/decorator/auth/roles.decorator';
import { PassAccessTokenCheck } from './auth/decorator/jwt/passAccessTokenCheck';
import { IpRateLimitGuard } from './auth/guards/rate-limit/rate-limit.guard';
import { AccessTokenAuthGuard } from './auth/guards/jwt/acess-token-auth.guard';

export {
  // module
  AuthModule,

  // guards
  ApiKeyGuard,
  RolesGuard,
  AccessTokenAuthGuard,

  // decorators
  Public,
  PassAccessTokenCheck,
  Roles,
  IpRateLimitGuard,
};
