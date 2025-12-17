import { Response } from 'express';
import Teammate from '../models/teammate.js';
import Category from '../models/category.js';
import Question from '../models/question.js';
import Review from '../models/review.js';
import Answer from '../models/answer.js';
import { AuthRequest } from '../middleware/auth.js';
import { sequelize } from '../config/database.js';

// GET /feedback/:teammateId
const getFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { teammateId } = req.params;
    const { reviewId } = req.query;

    // Verify teammate exists
    const teammate = await Teammate.findByPk(teammateId);
    if (!teammate) {
      res.status(404).json({
        success: false,
        error: {
          code: 'TEAMMATE_NOT_FOUND',
          details: { message: 'Teammate not found' }
        }
      });
      return;
    }

    // Get all categories with their questions
    const categories = await Category.findAll({
      include: [
        {
          model: Question,
          as: 'questions',
          attributes: ['id', 'questionText']
        }
      ]
    });

    // Get existing answers if reviewId is provided
    let answers: Answer[] = [];
    if (reviewId) {
      answers = await Answer.findAll({
        where: { reviewId: reviewId as string }
      });
    }

    // Build the response structure
    const feedback = categories.map(category => ({
      category: {
        id: category.id,
        name: category.name
      },
      questions: (category as any).questions.map((question: any) => {
        const existingAnswer = answers.find(a => a.questionId === question.id);
        return {
          id: question.id,
          text: question.questionText,
          ...(existingAnswer && {
            answer: {
              value: existingAnswer.answer,
              comment: existingAnswer.commentText
            }
          })
        };
      })
    }));

    res.status(200).json({
      success: true,
      data: {
        teammate: {
          id: teammate.id,
          name: teammate.name
        },
        feedback
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_FEEDBACK_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

// POST /feedback/:teammateId
const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { teammateId } = req.params;
    const { feedback } = req.body;

    // Verify teammate exists
    const teammate = await Teammate.findByPk(teammateId, { transaction });
    if (!teammate) {
      await transaction.rollback();
      res.status(404).json({
        success: false,
        error: {
          code: 'TEAMMATE_NOT_FOUND',
          details: { message: 'Teammate not found' }
        }
      });
      return;
    }

    // Extract capturing user from auth token
    const capturingUserId = req.user?.id || 'anonymous';

    // Create a new review
    const review = await Review.create({
      teammateId: parseInt(teammateId),
      capturingUserId,
      period: new Date().toISOString().slice(0, 7) // YYYY-MM format
    }, { transaction });

    // Create answers for each question
    const answerPromises: Promise<Answer>[] = [];
    
    for (const categoryFeedback of feedback) {
      for (const questionFeedback of categoryFeedback.questions) {
        if (questionFeedback.answer) {
          answerPromises.push(
            Answer.create({
              reviewId: review.id,
              questionId: questionFeedback.id,
              answer: questionFeedback.answer.value,
              commentText: questionFeedback.answer.comment
            }, { transaction })
          );
        }
      }
    }

    await Promise.all(answerPromises);
    await transaction.commit();

    res.status(201).json({
      success: true,
      data: {
        reviewId: review.id
      }
    });
  } catch (error) {
    await transaction.rollback();
    
    // Differentiate between client errors and server errors
    const isClientError = error instanceof Error && 
      (error.message.includes('validation') || 
       error.message.includes('Invalid') ||
       error.message.includes('required'));
    
    res.status(isClientError ? 400 : 500).json({
      success: false,
      error: {
        code: isClientError ? 'VALIDATION_ERROR' : 'SUBMIT_FEEDBACK_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

// PUT /feedback/:teammateId/:reviewId - Update existing feedback
const updateFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { teammateId, reviewId } = req.params;
    const { feedback } = req.body;
    const userId = req.user?.id;

    // Verify review exists and belongs to this user
    const review = await Review.findOne({
      where: {
        id: reviewId,
        teammateId: parseInt(teammateId),
        capturingUserId: userId
      },
      transaction
    });

    if (!review) {
      await transaction.rollback();
      res.status(404).json({
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          details: { message: 'Feedback not found or unauthorized' }
        }
      });
      return;
    }

    // Delete existing answers for this review
    await Answer.destroy({
      where: { reviewId: review.id },
      transaction
    });

    // Create new answers
    const answerPromises: Promise<Answer>[] = [];
    
    for (const categoryFeedback of feedback) {
      for (const questionFeedback of categoryFeedback.questions) {
        if (questionFeedback.answer) {
          answerPromises.push(
            Answer.create({
              reviewId: review.id,
              questionId: questionFeedback.id,
              answer: questionFeedback.answer.value,
              commentText: questionFeedback.answer.comment
            }, { transaction })
          );
        }
      }
    }

    await Promise.all(answerPromises);
    await transaction.commit();

    res.status(200).json({
      success: true,
      data: {
        reviewId: review.id
      }
    });
  } catch (error) {
    await transaction.rollback();
    
    const isClientError = error instanceof Error && 
      (error.message.includes('validation') || 
       error.message.includes('Invalid') ||
       error.message.includes('required'));
    
    res.status(isClientError ? 400 : 500).json({
      success: false,
      error: {
        code: isClientError ? 'VALIDATION_ERROR' : 'UPDATE_FEEDBACK_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

// DELETE /feedback/:teammateId/:reviewId - Delete feedback
const deleteFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  
  try {
    const { teammateId, reviewId } = req.params;
    const userId = req.user?.id;

    // Verify review exists and belongs to this user
    const review = await Review.findOne({
      where: {
        id: reviewId,
        teammateId: parseInt(teammateId),
        capturingUserId: userId
      },
      transaction
    });

    if (!review) {
      await transaction.rollback();
      res.status(404).json({
        success: false,
        error: {
          code: 'REVIEW_NOT_FOUND',
          details: { message: 'Feedback not found or unauthorized' }
        }
      });
      return;
    }

    // Delete answers first (due to foreign key)
    await Answer.destroy({
      where: { reviewId: review.id },
      transaction
    });

    // Delete the review
    await review.destroy({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    await transaction.rollback();
    
    res.status(500).json({
      success: false,
      error: {
        code: 'DELETE_FEEDBACK_ERROR',
        details: { message: (error as Error).message }
      }
    });
  }
};

export default {
  getFeedback,
  submitFeedback,
  updateFeedback,
  deleteFeedback
};
