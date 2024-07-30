import { Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RateLimiterService {
  constructor(private cacheManager: Cache) {}

  async isRateLimited(clientId: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Retrieve previous requests from cache
    const requests = await this.cacheManager.get<number[]>(clientId) || [];

    // Filter out requests outside the current time window
    const recentRequests = requests.filter(timestamp => timestamp > windowStart);

    // Update cache with recent requests
    await this.cacheManager.set(clientId, recentRequests, { ttl: windowMs });

    // Check if request limit is exceeded
    if (recentRequests.length >= limit) {
      return true; // Rate limited
    }

    // Add current request timestamp
    recentRequests.push(now);
    await this.cacheManager.set(clientId, recentRequests, { ttl: windowMs });

    return false; // Not rate limited
  }
}
