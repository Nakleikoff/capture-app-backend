import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const isOperational = isAppError ? err.isOperational : false;

  // Log error with context
  const errorLog = {
    message: err.message,
    statusCode,
    method: req.method,
    path: req.path,
    requestId: (req as any).id,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  };

  if (statusCode >= 500) {
    logger.error('Internal server error', errorLog);
  } else {
    logger.warn('Client error', errorLog);
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      code: isAppError ? 'APPLICATION_ERROR' : 'INTERNAL_SERVER_ERROR',
      details: {
        message: isOperational ? err.message : 'An unexpected error occurred',
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    },
  });
};

// 404 handler
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  next(new AppError(404, `Route ${req.method} ${req.path} not found`));
};
