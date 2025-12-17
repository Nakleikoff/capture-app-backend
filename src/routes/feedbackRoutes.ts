import express from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';
import { submitFeedbackSchema } from '../validators/schemas.js';

const router = express.Router();

// Get feedback form for a teammate (with optional existing review data)
router.get(
  '/:teammateId',
  authenticate,
  feedbackController.getFeedback
);

// Submit feedback for a teammate
router.post(
  '/:teammateId',
  authenticate,
  validateBody(submitFeedbackSchema),
  feedbackController.submitFeedback
);

// Update existing feedback
router.put(
  '/:teammateId/:reviewId',
  authenticate,
  validateBody(submitFeedbackSchema),
  feedbackController.updateFeedback
);

// Delete feedback
router.delete(
  '/:teammateId/:reviewId',
  authenticate,
  feedbackController.deleteFeedback
);

export default router;
