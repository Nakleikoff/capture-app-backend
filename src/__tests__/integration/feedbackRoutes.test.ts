import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';
import { generateTestToken } from '../utils/testHelpers.js';

describe('Feedback Routes Integration Tests', () => {
  let authToken: string;
  let teammateId: number;

  beforeAll(async () => {
    authToken = generateTestToken('user-d4e9f2a3', 'luke.turk@entelect.co.za');

    // Create a teammate for testing
    const response = await request(app)
      .post('/api/teammates')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        teammate: { name: 'Saxon Moore' }
      });

    teammateId = response.body.data.teammate.id;
  });

  describe('GET /api/feedback/:teammateId', () => {
    it('should return feedback form for teammate', async () => {
      const response = await request(app)
        .get(`/api/feedback/${teammateId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          teammate: {
            id: teammateId,
            name: expect.any(String)
          },
          feedback: expect.any(Array)
        }
      });

      // Verify feedback structure
      expect(response.body.data.feedback.length).toBeGreaterThan(0);
      expect(response.body.data.feedback[0]).toMatchObject({
        category: {
          id: expect.any(Number),
          name: expect.any(String)
        },
        questions: expect.any(Array)
      });
    });

    it('should return user\'s existing answers automatically', async () => {
      // First submit feedback
      const submitResponse = await request(app)
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
                    comment: 'Great communicator'
                  }
                }
              ]
            }
          ]
        });

      expect(submitResponse.status).toBe(201);

      // Now GET should return those answers without needing to pass reviewId
      const getResponse = await request(app)
        .get(`/api/feedback/${teammateId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data.reviewId).toBeDefined(); // Should include reviewId
      
      // Find the question we answered
      const category = getResponse.body.data.feedback.find((f: any) => f.category.id === 1);
      const question = category.questions.find((q: any) => q.id === 1);
      
      expect(question.answer).toMatchObject({
        value: 1,
        comment: 'Great communicator'
      });
    });

    it('should return 404 for non-existent teammate', async () => {
      const response = await request(app)
        .get('/api/feedback/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'TEAMMATE_NOT_FOUND'
        }
      });
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .get(`/api/feedback/${teammateId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/feedback/:teammateId', () => {
    it('should submit feedback successfully', async () => {
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
                    comment: 'Excellent communication skills!'
                  }
                }
              ]
            }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        success: true,
        data: {
          reviewId: expect.any(Number)
        }
      });
    });

    it('should reject without authentication', async () => {
      const response = await request(app)
        .post(`/api/feedback/${teammateId}`)
        .send({
          feedback: [{ categoryId: 1, questions: [] }]
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/feedback/:teammateId/:reviewId', () => {
    it('should update existing feedback', async () => {
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
                  answer: { value: 0, comment: 'Initial feedback' }
                }
              ]
            }
          ]
        });

      const reviewId = createResponse.body.data.reviewId;

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
                  answer: { value: 1, comment: 'Updated feedback - much better!' }
                }
              ]
            }
          ]
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body).toMatchObject({
        success: true,
        data: {
          reviewId: reviewId
        }
      });
    });

    it('should reject update from different user', async () => {
      const differentUserToken = generateTestToken('different-user', 'other@example.com');

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
                  answer: { value: 1, comment: 'Unauthorized update' }
                }
              ]
            }
          ]
        });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('REVIEW_NOT_FOUND');
    });
  });

  describe('DELETE /api/feedback/:teammateId/:reviewId', () => {
    it('should delete feedback if user owns it', async () => {
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
                  answer: { value: -1, comment: 'To be deleted' }
                }
              ]
            }
          ]
        });

      const reviewId = createResponse.body.data.reviewId;

      // Delete it
      const deleteResponse = await request(app)
        .delete(`/api/feedback/${teammateId}/${reviewId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body).toMatchObject({
        success: true,
        message: 'Feedback deleted successfully'
      });
    });

    it('should reject deletion from different user', async () => {
      const differentUserToken = generateTestToken('another-user', 'another@example.com');

      const response = await request(app)
        .delete(`/api/feedback/${teammateId}/1`)
        .set('Authorization', `Bearer ${differentUserToken}`);

      expect(response.status).toBe(404);
    });
  });
});
