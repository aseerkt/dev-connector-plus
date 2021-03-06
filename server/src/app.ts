import cors from 'cors';
import express from 'express';
// import session from 'express-session';
// import MongoStore from 'connect-mongo';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import cookieParser from 'cookie-parser';
import { createUserLoader } from './utils/userLoader';
import { TypegooseMiddleware } from './middlewares/typegoose-middleware';

export const createApp = async () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.get('/', (_req, res) => res.send('API is running all fine'));

  app.use('/', express.static('public'));

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
      globalMiddlewares: [TypegooseMiddleware],
    }),
    context: ({ req, res }) => ({ req, res, userLoader: createUserLoader() }),
    uploads: false,
  });

  apolloServer.applyMiddleware({ app, cors: false });

  return { app };
};
