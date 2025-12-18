import express, { Application } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { cors } from './middleware/cors.js';
import { connectDB } from './config/database.js';
import teammateRoutes from './routes/teammateRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';

dotenv.config();

const app: Application = express();

// Only connect to DB in non-test environment
// In tests, the setup.ts file handles database connection
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.use(helmet());

app.use(
  cors([
    'http://localhost:3000',
    'https://capture-app-frontend.vercel.app', //adjust once we deploy
  ]),
);

app.use(express.json());

app.use('/api/teammates', teammateRoutes);
app.use('/api/feedback', feedbackRoutes);

export { app };
