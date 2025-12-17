import { Response } from 'express';
import Teammate from '../models/teammate.js';
import { AuthRequest } from '../middleware/auth.js';

// Create a new team mate
const createTeammate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teammate } = req.body;

    const newTeammate = await Teammate.create({
      name: teammate.name
    });

    res.status(201).json({
      success: true,
      data: {
        teammate: {
          id: newTeammate.id,
          name: newTeammate.name
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'CREATE_TEAMMATE_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

// Get all teammates
const getAllTeammates = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const teammates = await Teammate.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        teammates: teammates.map(t => ({
          id: t.id,
          name: t.name
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_TEAMMATES_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

export default { createTeammate, getAllTeammates };
