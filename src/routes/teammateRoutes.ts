import express from 'express';
import teammateController from '../controllers/teammateController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { createTeammateSchema } from '../validators/schemas.js';

const router = express.Router();

// Create a new teammate
router.post(
  '/',
  authenticate,
  validateBody(createTeammateSchema),
  teammateController.createTeammate
);

// Get all teammates
router.get(
  '/',
  authenticate,
  teammateController.getAllTeammates
);

export default router;
