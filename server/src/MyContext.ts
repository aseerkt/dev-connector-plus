import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { createUserLoader } from './utils/userLoader';

export type MyContext = {
  req: Request & { session: { userId: ObjectId | null } };
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
};
