import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import {
  authenticate,
  AuthRequest,
  generateToken,
} from '../../middleware/auth.js';
import jwt from 'jsonwebtoken';

describe('Authentication Middleware', () => {
  describe('authenticate', () => {
    it('should reject request without authorization header', () => {
      const req = {
        headers: {},
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          details: { message: 'No authorization token provided' },
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with malformed authorization header', () => {
      const req = {
        headers: {
          authorization: 'InvalidToken',
        },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          details: { message: 'No authorization token provided' },
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should reject request with invalid token', () => {
      const req = {
        headers: {
          authorization: 'Bearer invalid.token.here',
        },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          details: { message: 'Invalid or expired token' },
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should accept request with valid token', async () => {
      const token = generateToken(
        'user-e5f1a3b4',
        'alexey.maleykov@entelect.co.za',
      );

      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      await authenticate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect((req as AuthRequest).user).toMatchObject({
        id: 'user-e5f1a3b4',
        email: 'alexey.maleykov@entelect.co.za',
      });
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const token = generateToken(
        'user-e5f1a3b4',
        'alexey.maleykov@entelect.co.za',
      );

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');

      const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-production-key';
      const decoded = jwt.verify(token, JWT_SECRET) as {
        id: string;
        email: string;
      };

      expect(decoded.id).toBe('user-e5f1a3b4');
      expect(decoded.email).toBe('alexey.maleykov@entelect.co.za');
    });

    it('should generate token without email', () => {
      const token = generateToken('user456');

      expect(token).toBeTruthy();

      const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-production-key';
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      expect(decoded.id).toBe('user456');
    });
  });
});
