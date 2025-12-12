import Answer from './answer';
import Review from './review';
import Question from './question';
import Teammate from './teammate';

// Define associations
Answer.belongsTo(Review, {
  foreignKey: 'reviewId',
  as: 'review'
});
Answer.belongsTo(Question, {
  foreignKey: 'questionId',
  as: 'question'
});

Review.belongsTo(Teammate, {
  foreignKey: 'teammateId',
  as: 'teammate'
});

Question.hasMany(Answer, {
  foreignKey: 'answerId',
  as: 'answers'
});

Teammate.hasMany(Review, {
  foreignKey: 'reviewId',
  as: 'reviews'
});

export { Answer, Review, Teammate };
