import { AuthModule } from './auth/auth.module';
// guards
import { ApiKeyGuard } from './auth/guards/api/api-key.guard';
import { AccessTokenGuard } from './auth/guards/auth/access-token.guard';
import { IpRateLimitGuard } from './auth/guards/rate-limit/rate-limit.guard';
// decorators
import { PassAccessTokenCheck } from './auth/decorator/auth/passAccessTokenCheck';
import { NoRateLimit } from './auth/decorator/rate-limit/rate-limit.decorator';
import { Public } from './auth/decorator/api/public.decorator';

export {
  AuthModule,
  // guards
  ApiKeyGuard,
  AccessTokenGuard,
  IpRateLimitGuard,
  // decorators
  Public,
  PassAccessTokenCheck,
  NoRateLimit,
};
