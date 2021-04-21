import Cookie from 'cookie';
import { COOKIE_NAME } from '../config';
import { NextPageContext } from 'next';

export const getTokenFromRequest = (ctx: NextPageContext) => {
  const cookies = typeof window === 'undefined' ? ctx?.req?.headers.cookie : '';
  const jwt = cookies ? Cookie.parse(cookies)[COOKIE_NAME] : '';
  return jwt;
};
