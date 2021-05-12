import { sign, verify } from 'jsonwebtoken';
import { User } from '../entities/User';
import { __prod__ } from '../constants';

export const setToken = (user: User) =>
  sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

export const verfiyToken = (token: string) =>
  verify(token, process.env.JWT_SECRET!);
