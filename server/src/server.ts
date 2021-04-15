import 'reflect-metadata';
import 'dotenv/config';
import 'colors';
import { connectDB } from './config/db';
import { PORT } from './constants';
import { createApp } from './app';

const main = async () => {
  await connectDB();

  const { app, apolloServer } = await createApp();

  app.listen(PORT, () => {
    console.log(
      `App running on http://localhost:${PORT}${apolloServer.graphqlPath}`.blue
        .bold
    );
  });
};

main().catch((err) => console.log('Root Error'.red.underline.bold, err));
