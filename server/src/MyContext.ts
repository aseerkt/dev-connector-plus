import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { createUserLoader } from './utils/userLoader';

export type MyContext = {
  req: Request;
  res: Response & { locals: { userId: ObjectId | null } };
  userLoader: ReturnType<typeof createUserLoader>;
};
