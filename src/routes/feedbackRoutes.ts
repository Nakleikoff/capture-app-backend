import express from 'express';
import feedbackController from '../controllers/feedbackController.js';
import { validateBody } from '../middleware/validate.js';
import { submitFeedbackSchema } from '../validators/schemas.js';

const router = express.Router();

/**
 * @swagger
 * /feedback/{teammateId}:
 *   get:
 *     summary: Get feedback form for a teammate
 *     description: Returns feedback form with questions. If user has existing review, includes their answers.
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: teammateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Teammate ID
 *     responses:
 *       200:
 *         description: Feedback form data
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/:teammateId', feedbackController.getFeedback);

/**
 * @swagger
 * /feedback/{teammateId}:
 *   post:
 *     summary: Submit feedback for a teammate
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: teammateId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [period, answers]
 *             properties:
 *               period:
 *                 type: string
 *                 example: 2024-Q1
 *               answers:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Answer'
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/:teammateId',
  validateBody(submitFeedbackSchema),
  feedbackController.submitFeedback,
);

/**
 * @swagger
 * /feedback/{teammateId}/{reviewId}:
 *   put:
 *     summary: Update existing feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: teammateId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [period, answers]
 *             properties:
 *               period:
 *                 type: string
 *               answers:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Answer'
 *     responses:
 *       200:
 *         description: Feedback updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.put(
  '/:teammateId/:reviewId',
  validateBody(submitFeedbackSchema),
  feedbackController.updateFeedback,
);

/**
 * @swagger
 * /feedback/{teammateId}/{reviewId}:
 *   delete:
 *     summary: Delete feedback
 *     tags: [Feedback]
 *     parameters:
 *       - in: path
 *         name: teammateId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Feedback deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.delete('/:teammateId/:reviewId', feedbackController.deleteFeedback);

export default router;
