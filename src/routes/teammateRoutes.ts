import express from 'express';
import teammateController from '../controllers/teammateController.js';
import { validateBody } from '../middleware/validate.js';
import { createTeammateSchema } from '../validators/schemas.js';

const router = express.Router();

/**
 * @swagger
 * /teammates:
 *   post:
 *     summary: Create a new teammate
 *     tags: [Teammates]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: Teammate created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Teammate'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post(
  '/',
  validateBody(createTeammateSchema),
  teammateController.createTeammate,
);

/**
 * @swagger
 * /teammates:
 *   get:
 *     summary: Get all teammates
 *     tags: [Teammates]
 *     responses:
 *       200:
 *         description: List of all teammates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Teammate'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.get('/', teammateController.getAllTeammates);

export default router;
