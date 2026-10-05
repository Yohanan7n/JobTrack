import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

interface AttemptRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, AttemptRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 15; // Max 15 attempts per IP per 15 minutes

export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = loginAttempts.get(clientIp);

  if (record) {
    if (now > record.resetAt) {
      // Window expired, reset counter
      loginAttempts.set(clientIp, { count: 1, resetAt: now + WINDOW_MS });
      return next();
    }

    if (record.count >= MAX_ATTEMPTS) {
      const waitMinutes = Math.ceil((record.resetAt - now) / 60000);
      return errorResponse(
        res,
        `Too many login attempts from this IP address. Please try again in ${waitMinutes} minute(s) to protect your account against unauthorized access.`,
        429
      );
    }

    record.count += 1;
    return next();
  }

  // First attempt
  loginAttempts.set(clientIp, { count: 1, resetAt: now + WINDOW_MS });
  return next();
};

// Periodically clean up expired records to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of loginAttempts.entries()) {
    if (now > record.resetAt) {
      loginAttempts.delete(ip);
    }
  }
}, 5 * 60 * 1000);
