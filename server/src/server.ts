import 'reflect-metadata';
import 'dotenv/config';
import 'colors';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { ApolloServer } from 'apollo-server-express';
import { connectDB } from './config/db';
import { buildSchema } from 'type-graphql';
import { COOKIE_NAME, PORT } from './constants';
import { createUserLoader } from './utils/userLoader';
import { TypegooseMiddleware } from './middlewares/typegoose-middleware';

const main = async () => {
  await connectDB();

  const app = express();

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

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [__dirname + '/resolvers/**/*.{ts,js}'],
      globalMiddlewares: [TypegooseMiddleware],
    }),
    context: ({ req, res }) => ({ req, res, userLoader: createUserLoader() }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => {
    console.log(
      `App running on http://localhost:${PORT}${apolloServer.graphqlPath}`.blue
        .bold
    );
  });
};

main().catch((err) => console.log('Root Error'.red.underline.bold, err));
