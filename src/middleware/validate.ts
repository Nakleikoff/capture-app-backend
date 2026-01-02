import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            details: {
              message: 'Invalid request data',
              errors: error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
              })),
            },
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            details: { message: 'Validation failed' },
          },
        });
      }
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Convert query params to the expected format for Zod
      const query = Object.fromEntries(
        Object.entries(req.query).map(([key, value]) => [
          key,
          value === undefined ? undefined : String(value),
        ]),
      );

      req.query = schema.parse(query) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            details: {
              message: 'Invalid query parameters',
              errors: error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
              })),
            },
          },
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            details: { message: 'Validation failed' },
          },
        });
      }
    }
  };
};
