import { sequelize } from '../config/database.js';
import Category from '../models/category.js';
import Question from '../models/question.js';
import '../models/index.js';

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database seeding...');

    // Check if already seeded
    const categoryCount = await Category.count();
    if (categoryCount > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    await sequelize.transaction(async (t) => {
      // Create Categories
      const categories = await Promise.all([
        Category.create({ name: 'Communication' }, { transaction: t }),
        Category.create({ name: 'Technical Skills' }, { transaction: t }),
        Category.create({ name: 'Teamwork' }, { transaction: t }),
        Category.create({ name: 'Problem Solving' }, { transaction: t }),
      ]);

      console.log(`Created ${categories.length} categories`);
      // Create Questions for each category
      const questions = [];

      // Communication questions
      questions.push(
        await Question.create(
          {
            questionText:
              'Does the teammate communicate clearly and effectively?',
            categoryId: categories[0].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText: 'Does the teammate actively listen to others?',
            categoryId: categories[0].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText: 'Does the teammate provide timely updates?',
            categoryId: categories[0].id,
          },
          { transaction: t },
        ),
      );

      // Technical Skills questions
      questions.push(
        await Question.create(
          {
            questionText:
              'Does the teammate demonstrate strong technical abilities?',
            categoryId: categories[1].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText:
              'Does the teammate write clean and maintainable code?',
            categoryId: categories[1].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText:
              'Does the teammate stay current with technology trends?',
            categoryId: categories[1].id,
          },
          { transaction: t },
        ),
      );

      // Teamwork questions
      questions.push(
        await Question.create(
          {
            questionText: 'Does the teammate collaborate well with others?',
            categoryId: categories[2].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText: 'Does the teammate support team members?',
            categoryId: categories[2].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText: 'Does the teammate contribute to team morale?',
            categoryId: categories[2].id,
          },
          { transaction: t },
        ),
      );

      // Problem Solving questions
      questions.push(
        await Question.create(
          {
            questionText: 'Does the teammate approach problems analytically?',
            categoryId: categories[3].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText: 'Does the teammate find creative solutions?',
            categoryId: categories[3].id,
          },
          { transaction: t },
        ),
        await Question.create(
          {
            questionText: 'Does the teammate handle challenges effectively?',
            categoryId: categories[3].id,
          },
          { transaction: t },
        ),
      );

      console.log(`Created ${questions.length} questions`);
    });

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
};
