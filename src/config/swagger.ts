import swaggerJsdoc from 'swagger-jsdoc';
import { env } from '../config/env.js';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Capture App API',
      version: '1.0.0',
      description: 'REST API for teammate feedback and performance reviews',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url:
          env.NODE_ENV === 'production'
            ? 'https://domain.com/api'
            : `http://localhost:${env.PORT}/api`,
        description:
          env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'UNAUTHORIZED' },
                      details: {
                        type: 'object',
                        properties: {
                          message: {
                            type: 'string',
                            example: 'No token provided',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: false },
                  error: {
                    type: 'object',
                    properties: {
                      code: { type: 'string', example: 'VALIDATION_ERROR' },
                      details: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      schemas: {
        Teammate: {
          type: 'object',
          required: ['name'],
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'John Doe' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            capturingUserId: { type: 'string', example: 'user123' },
            period: { type: 'string', example: '2024-Q1' },
            teammateId: { type: 'integer', example: 1 },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Answer: {
          type: 'object',
          required: ['answer', 'commentText', 'questionId'],
          properties: {
            answer: { type: 'integer', minimum: 1, maximum: 5, example: 4 },
            commentText: {
              type: 'string',
              example: 'Great communication skills',
            },
            questionId: { type: 'integer', example: 1 },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
