import { sign, verify } from 'jsonwebtoken';
import { User } from '../entities/User';
import { COOKIE_NAME, __prod__ } from '../constants';
import { Response } from 'express';

export const setToken = (user: User) =>
  sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

export const setTokenToCookie = (res: Response, user: User) => {
  res.cookie(COOKIE_NAME, setToken(user), {
    httpOnly: true,
    secure: __prod__,
    sameSite: __prod__ ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const verfiyToken = (token: string) =>
  verify(token, process.env.JWT_SECRET!);
