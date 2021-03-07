import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

export type MyContext = {
  req: Request & { session: { userId: ObjectId | null } };
  res: Response;
};
