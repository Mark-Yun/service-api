import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 4000,
  mongodbUri: process.env.MONGODB_URI,
};
