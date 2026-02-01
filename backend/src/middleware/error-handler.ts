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
  if (err instanceof AppError) {
    logger.error(`${err.statusCode} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  }

  // Unknown error
  logger.error(`500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`, {
    stack: err.stack,
  });

  return res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
