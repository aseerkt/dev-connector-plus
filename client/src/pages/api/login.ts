// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE_NAME } from '../../config';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { jwt } = req.body;

    if (jwt) {
      res.setHeader(
        'Set-Cookie',
        Cookie.serialize(COOKIE_NAME, jwt, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          sameSite: 'strict',
          path: '/',
        })
      );
      return res.json({ ok: true });
    } else {
      res.status(400).send('OOps');
    }
  } else {
    return res.status(400).send('OOps');
  }
};
