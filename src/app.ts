import express, { Application } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { cors } from './middleware/cors.js';
import { sanitizeInput } from './middleware/sanitize.js';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';
import teammateRoutes from './routes/teammateRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

const app: Application = express();

// Only connect to DB in non-test environment
// In tests, the setup.ts file handles database connection
if (env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      details: { message: 'Too many requests, please try again later.' }
    }
  }
});

app.use('/api/', limiter);

app.use(
  cors([
    'http://localhost:3000',
    'https://capture-app-frontend.vercel.app', //adjust once we deploy
  ]),
);

app.use(express.json());
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV
    }
  });
});

app.use('/api/teammates', teammateRoutes);
app.use('/api/feedback', feedbackRoutes);

export { app };
