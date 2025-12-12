import express from 'express';
import teammateController from '../controllers/teammateController.js';

const router = express.Router();

// Create a new teammate
router.post('/', teammateController.createTeammate);

// Get all teammates
router.get('/', teammateController.getAllTeammates);

export default router;
