import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
// @ts-expect-error - no proper types available for express-request-id
import requestId from 'express-request-id';
import swaggerUi from 'swagger-ui-express';
import { cors } from './middleware/cors.js';
import { sanitizeInput } from './middleware/sanitize.js';
import { rateLimiter } from './middleware/rateLimit.js';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger, requestLogger } from './utils/logger.js';
import { connectDB } from './config/database.js';
import { swaggerSpec } from './config/swagger.js';
import { env } from './config/env.js';
import healthRoutes from './routes/healthRoutes.js';
import teammateRoutes from './routes/teammateRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const app: Application = express();

// Only connect to DB in non-test environment
// In tests, the setup.ts file handles database connection
if (env.NODE_ENV !== 'test') {
  connectDB();
}

// Security & compression
app.use(helmet());
app.use(compression());

// Request tracking
app.use(requestId());
app.use(requestLogger);

// Rate limiting
app.use('/api/', rateLimiter);

// CORS
app.use(
  cors([
    'http://localhost:3000',
    'https://capture-app-frontend.vercel.app', //adjust once we deploy
  ]),
);

// Body parsing & sanitization
app.use(express.json());
app.use(sanitizeInput);

// API Documentation
// Relax CSP for Swagger UI so the client-side bundle can execute (only for docs route)
app.use(
  '/api-docs',
  (_req: Request, res: Response, next: NextFunction) => {
    // Relax CSP for Swagger UI in non-production environments to allow its client bundle to run
    if (env.NODE_ENV !== 'production') {
      res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';",
      );
    }
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Capture App API Docs',
  }),
);

// Routes

// Apply authentication middleware to all /api routes
app.use('/api', authenticate);
app.use('/health', healthRoutes);
app.use('/api/teammates', teammateRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export { app, logger };
