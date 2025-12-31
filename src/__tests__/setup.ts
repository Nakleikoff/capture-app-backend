import { beforeAll, afterAll } from 'vitest';
import { sequelize } from '../config/database.js';
import { seedDatabase } from '../config/seed.js';
import '../models/index.js';

// Setup test database before all tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Force recreate tables in test env
    console.log('Test database connection established');

    // Seed the database with categories and questions
    await seedDatabase();
  } catch (error) {
    console.error('Unable to connect to test database:', error);
    throw error;
  }
});

// Close database connection after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    console.log('Test database connection closed');
  } catch (error) {
    console.error('Error closing database:', error);
  }
});
