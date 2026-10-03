import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('[Error Middleware]:', err);

  if (err.name === 'ZodError') {
    const message = err.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ');
    return errorResponse(res, `Validation error: ${message}`, 400);
  }

  if (err.code === 'P2002') {
    return errorResponse(res, 'A record with this unique field already exists', 409);
  }

  if (err.code === 'P2025') {
    return errorResponse(res, 'Record not found in database', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return errorResponse(res, message, statusCode);
};
