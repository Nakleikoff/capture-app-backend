import { Sequelize } from 'sequelize';
import { env } from './env.js';

export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: env.NODE_ENV === 'development' ? console.log : false,
  },
);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // In test/development, allow sync for convenience
    // In production, rely on migrations
    if (env.NODE_ENV === 'test') {
      await sequelize.sync({ alter: true });
      console.log('Test database synchronized.');
      
      // Seed database with initial data for tests
      const { seedDatabase } = await import('./seed.js');
      await seedDatabase();
    } else {
      console.log('Production mode: Run migrations separately using "npm run migrate"');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    if (env.NODE_ENV !== 'test') {
      process.exit(1);
    }
    throw error;
  }
};
