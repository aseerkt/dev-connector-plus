import { sign, verify } from 'jsonwebtoken';
import { User } from '../entities/User';
import { COOKIE_NAME, __prod__ } from '../constants';
import { CookieOptions, Response } from 'express';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: __prod__,
  sameSite: __prod__ ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const setToken = (user: User) =>
  sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

export function setTokenToCookie(res: Response, user: User) {
  res.cookie(COOKIE_NAME, setToken(user), COOKIE_OPTIONS);
}

export function clearTokenFromCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, COOKIE_OPTIONS);
}

export const verfiyToken = (token: string) =>
  verify(token, process.env.JWT_SECRET!);
