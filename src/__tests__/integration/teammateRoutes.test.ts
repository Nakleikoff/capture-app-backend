import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { generateTestToken } from '../utils/testHelpers.js';
import Teammate from '../../models/teammate.js';

describe('Teammate Routes Integration Tests', () => {
  let authToken: string;

  beforeAll(() => {
    authToken = generateTestToken(
      'user-c3d8e9f1',
      'mitchell.maber@entelect.co.za',
    );
  });

  describe('POST /api/teammates', () => {
    it('should create a new teammate with valid token and data', async () => {
      const response = await request(app)
        .post('/api/teammates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          teammate: {
            name: 'Nigel Gavin',
          },
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          teammate: {
            id: expect.any(Number),
            name: 'Nigel Gavin',
          },
        },
      });
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .post('/api/teammates')
        .send({
          teammate: { name: 'Luke Turk' },
        });

      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
        },
      });
    });
  });

  describe('GET /api/teammates', () => {
    it('should return all teammates', async () => {
      const response = await request(app)
        .get('/api/teammates')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          teammates: expect.any(Array),
        },
      });
    });

    it('should reject request without authentication', async () => {
      const response = await request(app).get('/api/teammates');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/teammates', () => {
    it('should return validation error when name is null', async () => {
      const response = await request(app)
        .post('/api/teammates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: null });

      expect(response.statusCode).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
      expect(response.body.error.details).toBeDefined();
      expect(response.body.error.details.message).toBe('Invalid request data');
      expect(response.body.error.details.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'teammate',
            message: 'Invalid input: expected object, received undefined',
          }),
        ]),
      );
    });
  });

  describe('POST /api/teammates - error case', () => {
    it('returns 400 when DB fails', async () => {
      vi.spyOn(Teammate, 'create').mockRejectedValueOnce(new Error('DB down'));

      const res = await request(app)
        .post('/api/teammates')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Bob' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
