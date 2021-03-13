import 'reflect-metadata';
import 'dotenv/config';
import 'colors';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { graphqlUploadExpress } from 'graphql-upload';
import { connectDB } from './config/db';
import { COOKIE_NAME, PORT } from './constants';
import { createUserLoader } from './utils/userLoader';
import { TypegooseMiddleware } from './middlewares/typegoose-middleware';

const main = async () => {
  await connectDB();

  const app = express();

  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET!,
      store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
      saveUninitialized: false,
      resave: false,
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

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

  app.listen(PORT, () => {
    console.log(
      `App running on http://localhost:${PORT}${apolloServer.graphqlPath}`.blue
        .bold
    );
  });
};

main().catch((err) => console.log('Root Error'.red.underline.bold, err));
