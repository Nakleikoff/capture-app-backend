import { beforeAll, afterAll } from 'vitest';
import { sequelize } from '../config/database.js';
import '../models/index.js';

// Setup test database before all tests
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: false }); // Don't modify schema in tests
    console.log('Test database connection established');
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
