import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { errorResponse } from '../utils/response';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return errorResponse(
      res,
      'Forbidden: Administrator access required',
      403
    );
  }
  next();
};
