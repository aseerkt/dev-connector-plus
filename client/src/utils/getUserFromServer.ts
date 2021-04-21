import { IncomingMessage } from 'http';
import Cookie from 'cookie';
import { NextApiRequestCookies } from 'next/dist/next-server/server/api-utils';
import { MeDocument, MeQuery } from '../generated/graphql';
import { COOKIE_NAME } from '../config';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { getTokenFromRequest } from './getTokenFromRequest';

// const COOKIE_NAME = 'gitToken';

export const getUserFromServer = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  req: IncomingMessage & {
    cookies: NextApiRequestCookies;
  }
) => {
  const jwt = getTokenFromRequest(req);
  console.log({ jwt });
  const res = await apolloClient.query<MeQuery>({
    query: MeDocument,
    context: { headers: { authorization: `Bearer ${jwt}` } },
  });
  // console.log(res);
  const user = res.data.me;
  // console.log(res);
  return user;
};
