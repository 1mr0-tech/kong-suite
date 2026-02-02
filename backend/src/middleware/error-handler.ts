import type { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (err instanceof AppError) {
    // Log operational errors
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Unknown/programming error - this is a security concern
  logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    // Only log stack trace in development
    ...(isDevelopment && { stack: err.stack }),
    userAgent: req.get('user-agent'),
    referer: req.get('referer'),
  });

  // Never expose internal error details to clients in production
  return res.status(500).json({
    success: false,
    error: isDevelopment ? err.message : 'Internal server error',
    // Include stack trace only in development
    ...(isDevelopment && { stack: err.stack }),
  });
};
