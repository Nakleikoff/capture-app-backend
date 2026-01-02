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

    console.log("Auth token: ", authToken);
  });

  describe('POSITIVE TESTS', () => {

    describe('GET /api/teammates', () => {

      it('should return empty array when no teammates exist', async () => {

        // Act
        const response = await request(app)
          .get('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          success: true,
          data: {
            teammates: [],
          },
        });
      });

      it('should return all teammates', async () => {

        // Arrange
        const teammates = ['Teammate One', 'Teammate Two', 'Teammate Three',
          'Teammate Four', 'Teammate Five'];

        await Promise.all(
          teammates.map(name =>
            request(app)
              .post('/api/teammates')
              .set('Authorization', `Bearer ${authToken}`)
              .send({ teammate: { name } })
          )
        );

        // Act
        const response = await request(app)
          .get('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.teammates).toHaveLength(5);
        expect(response.body.data.teammates).toEqual(
          expect.arrayContaining(
            teammates.map(name => expect.objectContaining({ name }))
          )
        );
      });
    });

    describe('POST /api/teammates', () => {

      it('should create a new teammate with valid token and data', async () => {

        // Arrange
        const teammateName = 'Nigel Gavin';

        // Act
        const response = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: {
              name: teammateName,
            },
          });

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          success: true,
          data: {
            teammate: {
              id: expect.any(Number),
              name: teammateName,
            },
          },
        });
      });

      it('should allow duplicate names to be created with unique ids', async () => {

        // Arrange
        const response1 = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: { name: 'Duplicate User' },
          });

        expect(response1.status).toBe(201);
        const id1 = response1.body.data.teammate.id;

        // Act
        const response2 = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: { name: 'Duplicate User' },
          });

        // Assert
        expect(response2.status).toBe(201);
        const id2 = response2.body.data.teammate.id;
        expect(id1).not.toBe(id2);
      });
    });
  });

  describe('NEGATIVE TESTS', () => {

    describe('GET /api/teammates', () => {

      it('should reject request without authentication', async () => {

        // Act
        const response = await request(app).get('/api/teammates');

        // Assert
        expect(response.status).toBe(401);
      });
    });

    describe('POST /api/teammates', () => {

      it('should throw appropriate error when name is null', async () => {

        // Arrange
        const teammateName = null;

        // Act
        const response = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: { name: teammateName },
          });

        // Asser
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
        expect(response.body.error.details).toBeDefined();
        expect(response.body.error.details.message).toBe('Invalid request data');
        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'teammate.name',
              message: 'Invalid input: expected string, received null',
            }),
          ]),
        );
      });

      it('should throw appropriate error when name is not a string', async () => {

        // Arrange
        const teammateName = true;


        // Act
        const response = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: { name: teammateName },
          });

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
        expect(response.body.error.details).toBeDefined();
        expect(response.body.error.details.message).toBe('Invalid request data');
        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'teammate.name',
              message: 'Invalid input: expected string, received boolean',
            }),
          ]),
        );
      });

      it('should throw appropriate error when name is empty string', async () => {

        // Arrange
        const teammateName = '';

        // Act
        const response = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: { name: teammateName },
          });

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
        expect(response.body.error.details.message).toBe('Invalid request data');
        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'teammate.name',
              message: 'Name is required',
            }),
          ]),
        );
      });

      it('should throw appropriate error when name property is not supplied', async () => {

        // Act
        const response = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            teammate: { },
          });

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.error.code).toBe('VALIDATION_ERROR');
        expect(response.body.error.details.message).toBe('Invalid request data');
        expect(response.body.error.details.errors).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              field: 'teammate.name',
              message: 'Invalid input: expected string, received undefined',
            }),
          ]),
        );
      });

      it('should reject request without authentication', async () => {

        // Arrange
        const teammateName = 'Luke Turk';

        // Act
        const response = await request(app)
          .post('/api/teammates')
          .send({
            teammate: { name: teammateName },
          });

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
          },
        });
      });

      it('returns 400 when request is valid but database is down', async () => {

        // Arrange
        const teammateName = 'Luke Turk';
        vi.spyOn(Teammate, 'create').mockRejectedValueOnce(new Error('Database is down'));

        // Act
        const response = await request(app)
          .post('/api/teammates')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ name: teammateName });

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });
    });
  });
});