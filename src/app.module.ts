import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { RateLimiterMiddleware } from './rate-limiter/rate-limiter.middleware';
import { RateLimiterService } from './rate-limiter/rate-limiter.service';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory', // In-memory cache store
      ttl: 0, // Use custom TTL for each cache item
    }),
  ],
  providers: [RateLimiterService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .forRoutes('*'); // Apply to all routes
  }
}
