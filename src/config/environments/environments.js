import 'dotenv/config';
import env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  CONNECTION_STRING: env.get('CONNECTION_STRING').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  CLIENT_URL: env.get('CLIENT_URL').required().asString(),
};