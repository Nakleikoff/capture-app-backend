import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { cors } from './middleware/cors.js';
import { connectDB } from './config/database.js';
import teammateRoutes from './routes/teammateRoutes.js';

dotenv.config();

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors([
    'http://localhost:3000',
    'https://capture-app-frontend.vercel.app', //adjust once we deploy
  ]),
);

app.use('/api/teammates', teammateRoutes);

export { app };
