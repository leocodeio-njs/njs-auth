#### Auth Module

```bash
pnpm add @leocodeio-njs/njs-auth
```

```typescript
// import auth module
import { AuthModule } from '@leocodeio-njs/njs-auth';

// Add the module to the imports array of your main module
@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}

// env variables
AUTHORIZER_URL = 'https://authorizer.leocode.io';
AUTHORIZER_API_KEY = 'your_api_key';
X_API_KEY = 'your_api_key';
```


NestJs application for user management of spectral

```bash
src/
  |_ config/
  |_ core/
  |_ utils/
    |_ health/
    |_ logging/
  |_ modules/
    |_ **creator**/
      |_ application/
        |_ dtos/
        |_ services/
      |_ domain/
        |_ ports/
        |_ enums/
        |_ models/
      |_ infrastructure/
        |_ adapters/
        |_ entities/
      |_ presentation/
        |_ controllers/
    |_ **contrib**/
  |_ common/
    |_ guard/
      |_ api/
      |_ auth/
      |_ jwt/
    |_ decorator/
      |_ api/
      |_ auth/
      |_ jwt/
    |_ exception/
      |_ filters/
      |_ application.excpetion.ts
      |_ domain.excpetion.ts
      |_ database.excpetion.ts
      |_ dependency.excpetion.ts
    |_ services/
    |_ interfaces/
```