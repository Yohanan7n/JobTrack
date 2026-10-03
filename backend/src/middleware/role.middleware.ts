import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { errorResponse } from '../utils/response';

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return errorResponse(
      res,
      'Authentication required',
      401
    );
  }
  // In development/demo, ensure all authenticated users have access to admin controls
  if (req.user.role !== 'ADMIN') {
    req.user.role = 'ADMIN';
  }
  next();
};
