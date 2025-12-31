import Answer from './answer.js';
import Review from './review.js';
import Question from './question.js';
import Teammate from './teammate.js';
import Category from './category.js';

// Define associations
Answer.belongsTo(Review, {
  foreignKey: 'reviewId',
  as: 'review',
});
Answer.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question',
});

Review.belongsTo(Teammate, {
  foreignKey: 'teammateId',
  as: 'teammate',
});
Review.hasMany(Answer, {
  foreignKey: 'reviewId',
  as: 'answers',
});

Question.hasMany(Answer, {
  foreignKey: 'questionId',
  as: 'answers',
});
Question.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

Category.hasMany(Question, {
  foreignKey: 'categoryId',
  as: 'questions',
});

Teammate.hasMany(Review, {
  foreignKey: 'teammateId',
  as: 'reviews',
});

export { Answer, Review, Teammate, Question, Category };
