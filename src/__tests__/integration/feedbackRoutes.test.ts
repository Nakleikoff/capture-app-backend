import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { generateTestToken } from '../utils/testHelpers.js';

describe('Feedback Routes Integration Tests', () => {
  let authToken: string;
  let teammateId: number;
  let teammateName: string;

  beforeAll(async () => {
    authToken = generateTestToken('user-d4e9f2a3', 'luke.turk@entelect.co.za');

    console.log(authToken);

    // Create a teammate for testing
    const response = await request(app)
      .post('/api/teammates')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        teammate: { name: 'Saxon Moore' },
      });

    teammateId = response.body.data.teammate.id;
    teammateName = response.body.data.teammate.name;
  });

  describe('POSITIVE TESTS', () => {
    describe('GET /api/feedback/:teammateId', () => {
      it('should return empty feedback form for teammate wiht correct structure', async () => {
        // Act
        const response = await request(app)
          .get(`/api/feedback/${teammateId}`)
          .set('Authorization', `Bearer ${authToken}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
          success: true,
          data: {
            teammate: {
              id: teammateId,
              name: teammateName,
            },
            feedback: expect.any(Array),
          },
        });

        // Verify feedback structure
        expect(response.body.data.feedback).toHaveLength(4);

        expect(response.body.data.feedback).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              category: expect.objectContaining({
                id: expect.any(Number),
                name: 'Communication',
              }),
              questions: expect.any(Array),
            }),
            expect.objectContaining({
              category: expect.objectContaining({
                id: expect.any(Number),
                name: 'Technical Skills',
              }),
              questions: expect.any(Array),
            }),
            expect.objectContaining({
              category: expect.objectContaining({
                id: expect.any(Number),
                name: 'Teamwork',
              }),
              questions: expect.any(Array),
            }),
            expect.objectContaining({
              category: expect.objectContaining({
                id: expect.any(Number),
                name: 'Problem Solving',
              }),
              questions: expect.any(Array),
            }),
          ])
        );

        // Verify questions structure per category
        response.body.data.feedback.forEach((group: { questions: any[] }) => {
          expect(group.questions.length).toBeGreaterThan(0);

          group.questions.forEach((q) => {
            expect(q).toMatchObject({
              id: expect.any(Number),
              text: expect.any(String),
            });
          });
        });
      });
    });

    describe('POST /api/feedback/:teammateId', () => {
      it('should submit feedback successfully', async () => {
        // Act
        const response = await request(app)
          .post(`/api/feedback/${teammateId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            feedback: [
              {
                categoryId: 1,
                questions: [
                  {
                    id: 1,
                    answer: {
                      value: 1,
                      comment: 'Excellent communication skills!',
                    },
                  },
                ],
              },
            ],
          });

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
          success: true,
          data: {
            reviewId: expect.any(Number),
          },
        });
      });
    });

    describe('PUT /api/feedback/:teammateId/:reviewId', () => {
      it('should update existing feedback', async () => {
        // Arrange
        // First create a review
        const createResponse = await request(app)
          .post(`/api/feedback/${teammateId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            feedback: [
              {
                categoryId: 1,
                questions: [
                  {
                    id: 1,
                    answer: { value: 0, comment: 'Initial feedback' },
                  },
                ],
              },
            ],
          });

        const reviewId = createResponse.body.data.reviewId;

        // Act
        // Now update it
        const updateResponse = await request(app)
          .put(`/api/feedback/${teammateId}/${reviewId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            feedback: [
              {
                categoryId: 1,
                questions: [
                  {
                    id: 1,
                    answer: {
                      value: 1,
                      comment: 'Updated feedback - much better!',
                    },
                  },
                ],
              },
            ],
          });

        // Assert
        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body).toMatchObject({
          success: true,
          data: {
            reviewId: reviewId,
          },
        });
      });
    });

    describe('DELETE /api/feedback/:teammateId/:reviewId', () => {
      it('should delete feedback if user owns it', async () => {
        // Arrange
        // Create a review to delete
        const createResponse = await request(app)
          .post(`/api/feedback/${teammateId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            feedback: [
              {
                categoryId: 1,
                questions: [
                  {
                    id: 1,
                    answer: { value: -1, comment: 'To be deleted' },
                  },
                ],
              },
            ],
          });

        const reviewId = createResponse.body.data.reviewId;

        // Act
        // Delete it
        const deleteResponse = await request(app)
          .delete(`/api/feedback/${teammateId}/${reviewId}`)
          .set('Authorization', `Bearer ${authToken}`);

        // Assert
        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body).toMatchObject({
          success: true,
          message: 'Feedback deleted successfully',
        });
      });
    });
  });

  describe('NEGATIVE TESTS', () => {
    describe('GET /api/feedback/:teammateId', () => {
      it('should return 404 for non-existent teammate', async () => {
        // Arrange
        const nonExistentTeammateId = 99999

        // Act
        const response = await request(app)
          .get(`/api/feedback/${nonExistentTeammateId}`)
          .set('Authorization', `Bearer ${authToken}`);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          success: false,
          error: {
            code: 'TEAMMATE_NOT_FOUND',
          },
        });
      });

      it('should return 401 UNAUTHORIZED without authentication', async () => {

        // Act
        const response = await request(app).get(`/api/feedback/${teammateId}`);

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: {
              message: 'No authorization token provided',
            }
          }
        });
      });
    });

    describe('POST /api/feedback/:teammateId', () => {
      it('should return 401 UNAUTHORIZED without authentication', async () => {

        // Act
        const response = await request(app)
          .post(`/api/feedback/${teammateId}`)
          .send({
            feedback: [{ categoryId: 1, questions: [] }],
          });

        // Assert
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            details: {
              message: 'No authorization token provided',
            }
          }
        });
      });
    });

    describe('PUT /api/feedback/:teammateId/:reviewId', () => {
      it('should reject update from different user', async () => {
        const differentUserToken = generateTestToken(
          'different-user',
          'other@example.com',
        );

        const response = await request(app)
          .put(`/api/feedback/${teammateId}/1`)
          .set('Authorization', `Bearer ${differentUserToken}`)
          .send({
            feedback: [
              {
                categoryId: 1,
                questions: [
                  {
                    id: 1,
                    answer: { value: 1, comment: 'Unauthorized update' },
                  },
                ],
              },
            ],
          });

        expect(response.status).toBe(404);
        expect(response.body.error.code).toBe('REVIEW_NOT_FOUND');
      });
    });

    describe('DELETE /api/feedback/:teammateId/:reviewId', () => {
      it('should reject deletion from different user', async () => {
        const differentUserToken = generateTestToken(
          'another-user',
          'another@example.com',
        );

        const response = await request(app)
          .delete(`/api/feedback/${teammateId}/1`)
          .set('Authorization', `Bearer ${differentUserToken}`);

        expect(response.status).toBe(404);
      });
    });
  });
});
