import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-production-key';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          details: { message: 'No authorization token provided' }
        }
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
      (req as AuthRequest).user = decoded;
      next();
    } catch (jwtError) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          details: { message: 'Invalid or expired token' }
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

// Optional: middleware for endpoints that work with or without auth
export const optionalAuth = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email?: string };
      (req as AuthRequest).user = decoded;
    } catch {
      // Token invalid, but it's optional so continue without user
    }
  }

  next();
};

// Utility to generate tokens for testing
export const generateToken = (userId: string, email?: string): string => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '7d' });
};
