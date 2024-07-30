import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterService } from './rate-limiter.service';

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  constructor(private rateLimiterService: RateLimiterService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const clientId = req.ip; // Use IP address as client identifier
    const limit = 100; // Maximum number of requests
    const windowMs = 15 * 60 * 1000; // 15 minutes window

    const isLimited = await this.rateLimiterService.isRateLimited(clientId, limit, windowMs);
    if (isLimited) {
      throw new HttpException('Too Many Requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    next();
  }
}
