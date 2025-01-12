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
  providers: [AppService, { provide: APP_GUARD, useClass: ApiKeyGuard }],
})
export class AppModule {}
```
