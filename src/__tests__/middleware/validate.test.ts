import { describe, it, expect, vi } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { validateBody, validateQuery } from '../../middleware/validate.js';
import { z } from 'zod';

describe('Validation Middleware', () => {
  describe('validateBody', () => {
    it('should pass validation with valid data', () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().positive(),
      });

      const req = {
        body: { name: 'John', age: 25 },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should reject validation with invalid data', () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().positive(),
      });

      const req = {
        body: { name: '', age: -5 },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: expect.objectContaining({
            code: 'VALIDATION_ERROR',
          }),
        }),
      );
    });

    it('should return detailed validation errors', () => {
      const schema = z.object({
        email: z.string().email(),
        count: z.number().int(),
      });

      const req = {
        body: { email: 'invalid-email', count: 3.14 },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      const middleware = validateBody(schema);
      middleware(req, res, next);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            details: expect.objectContaining({
              errors: expect.arrayContaining([
                expect.objectContaining({
                  field: expect.any(String),
                  message: expect.any(String),
                }),
              ]),
            }),
          }),
        }),
      );
    });
  });

  describe('validateQuery', () => {
    it('should pass validation with valid query params', () => {
      const schema = z.object({
        page: z.string().regex(/^\d+$/).transform(Number),
        limit: z.string().regex(/^\d+$/).transform(Number),
      });

      const req = {
        query: { page: '1', limit: '10' },
      } as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      const middleware = validateQuery(schema);
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.query).toEqual({ page: 1, limit: 10 });
    });

    it('should reject validation with invalid query params', () => {
      const schema = z.object({
        page: z.string().regex(/^\d+$/),
      });

      const req = {
        query: { page: 'invalid' },
      } as unknown as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      const middleware = validateQuery(schema);
      middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
