import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import mongoose from 'mongoose';
import { schemas } from './graphql/index.js';
import config from './config/index.js';
import { makeExecutableSchema } from '@graphql-tools/schema';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

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
