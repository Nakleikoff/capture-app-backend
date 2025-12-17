import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt-secret-production-key';

export const generateTestToken = (userId: string, email?: string): string => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '1h' });
};

export const mockUser = {
  id: 'user-a7f3c2d1',
  email: 'lesego.rabanye@entelect.co.za'
};

export const mockTeammate = {
  id: 1,
  name: 'Lesego Rabanye',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockCategory = {
  id: 1,
  name: 'Communication',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockQuestion = {
  id: 1,
  questionText: 'Does the teammate communicate clearly?',
  categoryId: 1,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockReview = {
  id: 1,
  teammateId: 1,
  capturingUserId: 'user-a7f3c2d1',
  period: '2024-12',
  createdAt: new Date(),
  updatedAt: new Date()
};

export const mockAnswer = {
  id: 1,
  reviewId: 1,
  questionId: 1,
  answer: 1,
  commentText: 'Great communicator!',
  createdAt: new Date(),
  updatedAt: new Date()
};
