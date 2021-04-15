import { Request, Response } from 'express';
import { COOKIE_NAME, __prod__ } from '../constants';
import { User } from '../entities/User';
import { sign, verify } from 'jsonwebtoken';

export const setJWTCookie = (user: User, res: Response) => {
  res.cookie(
    COOKIE_NAME,
    sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' }),
    {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
      httpOnly: true,
      secure: __prod__,
      sameSite: __prod__ ? 'none' : 'lax',
    }
  );
};

export const verfiyToken = (token: string) =>
  verify(token, process.env.JWT_SECRET!);

export const extractTokenFromCookie = (req: Request) =>
  req.cookies[COOKIE_NAME];
