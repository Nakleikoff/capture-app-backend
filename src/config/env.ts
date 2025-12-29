import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  JWT_SECRET: string;
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'JWT_SECRET'
  ];

  const missing: string[] = [];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }

  if (process.env.JWT_SECRET?.startsWith('eyJ')) {
    throw new Error(
      'JWT_SECRET appears to be a JWT token, not a secret key.\n' +
      'Generate a proper secret with: openssl rand -base64 64'
    );
  }

  return {
    PORT: parseInt(process.env.PORT || '8080', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_HOST: process.env.DB_HOST as string,
    DB_PORT: parseInt(process.env.DB_PORT as string, 10),
    DB_NAME: process.env.DB_NAME as string,
    DB_USER: process.env.DB_USER as string,
    DB_PASSWORD: process.env.DB_PASSWORD as string,
    JWT_SECRET: process.env.JWT_SECRET as string
  };
}

export const env = validateEnv();
