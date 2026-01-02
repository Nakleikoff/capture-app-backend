import express from 'express';
import { env } from '../config/env.js';

const router = express.Router();

router.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: env.NODE_ENV,
    },
  });
});

export default router;
