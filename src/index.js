import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { schemas } from 'service-shared-core/graphql/index.js';
import config from './config/index.js'; // config가 디렉터리면 index.js 필요
import { makeExecutableSchema } from '@graphql-tools/schema';

const startServer = async () => {
  const app = express();

  const isDev = process.env.NODE_ENV !== 'production';

  const server = new ApolloServer({
    schema: makeExecutableSchema({
      typeDefs: schemas.v1.typeDefs,
      resolvers: schemas.v1.resolvers,
    }),
    introspection: isDev,
    playground: isDev,
  });

  await server.start();
  server.applyMiddleware({ app });

  await mongoose.connect(config.mongodbUri);
  console.log(`✅ MongoDB connected to ${config.mongodbUri}`);

  app.listen({ port: config.port }, () => {
    console.log(`🚀 Server ready at http://localhost:${config.port}${server.graphqlPath}`);
  });
};

startServer();
