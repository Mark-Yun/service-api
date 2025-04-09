import dotenv from 'dotenv';

dotenv.config();

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI,
};
