import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils';
import { MeDocument, MeQuery } from '../generated/graphql';
import { initializeApollo } from './withApollo';

// const COOKIE_NAME = 'gitToken';

export const getUserFromServer = async (
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) => {
  const apolloClient = initializeApollo();

  const res = await apolloClient.query<MeQuery>({
    query: MeDocument,
    context: { headers: { cookie: req.headers.cookie } },
  });
  // console.log(res);
  const user = res.data.me;
  return user;
};
