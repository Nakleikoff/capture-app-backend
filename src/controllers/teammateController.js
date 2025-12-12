import Teammate from '../models/teammate.js';

// Create a new team mate
const createTeammate = async (req, res) => {
  try {
    const { name } = req.body;

    const teammate = await Teammate.create({
      name
    });

    res.status(201).json({
      success: true,
      data: teammate
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all team mates
const getAllTeammates = async (req, res) => {
  try {
    const teammates = await Teammate.findAll();

    res.status(200).json({
      success: true,
      count: teammates.length,
      data: teammates
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export default { createTeammate, getAllTeammates };
