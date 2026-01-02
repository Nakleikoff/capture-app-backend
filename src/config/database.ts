import { Sequelize } from 'sequelize';
import { env } from './env.js';

const isProd = env.NODE_ENV === 'production';
const isTest = env.NODE_ENV === 'test';

export const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: !isProd && !isTest ? console.log : false,
  },
);

export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    if (isTest) {
      await sequelize.sync({ alter: true });
      console.log('Test database synchronized');

      const { seedDatabase } = await import('./seed.js');
      await seedDatabase();
    } else if (isProd) {
      console.log(
        'Production: Ensure migrations are run via "npm run migrate"',
      );
    } else {
      await sequelize.sync({ alter: true });
      console.log('Development database synchronized');

      const { seedDatabase } = await import('./seed.js');
      await seedDatabase();
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    if (!isTest) {
      process.exit(1);
    }
    throw error;
  }
};
