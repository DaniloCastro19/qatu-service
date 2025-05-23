import 'dotenv/config';
import env from 'env-var';

export const envs = {
  PORT: env.get('PORT').required().asPortNumber(),
  CONNECTION_STRING: env.get('CONNECTION_STRING').required().asString(),
  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  CLIENT_URL: env.get('CLIENT_URL').required().asString(),
  NODE_ENV:env.get('NODE_ENV').required().asString(),
  SESSION_INACTIVITY_TIMEOUT: env.get('SESSION_INACTIVITY_TIMEOUT').asIntPositive()
};
