import { z } from 'zod';

// Teammate validation schemas
export const createTeammateSchema = z.object({
  teammate: z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  }),
});

// Feedback validation schemas
export const submitFeedbackSchema = z.object({
  feedback: z
    .array(
      z.object({
        categoryId: z.number().int().positive(),
        questions: z.array(
          z.object({
            id: z.number().int().positive(),
            answer: z
              .object({
                value: z.union([z.literal(1), z.literal(-1), z.literal(0)]),
                comment: z.string().min(1, 'Comment is required'),
              })
              .optional(),
          }),
        ),
      }),
    )
    .min(1, 'At least one category required'),
});

// Query params schemas
export const getFeedbackQuerySchema = z.object({
  reviewId: z.string().regex(/^\d+$/).optional(),
});

export type CreateTeammateInput = z.infer<typeof createTeammateSchema>;
export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
export type GetFeedbackQuery = z.infer<typeof getFeedbackQuerySchema>;
