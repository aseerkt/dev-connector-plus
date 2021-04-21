import { createWithApollo } from './createWithApollo';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { getTokenFromRequest } from './getTokenFromRequest';
import { createUploadLink } from 'apollo-upload-client';
import { API_URL } from '../config';

const createClient = (ctx: NextPageContext) => {
  console.log({ ctx });
  const jwt = getTokenFromRequest(ctx);

  const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    credentials: 'include',
    headers: {
      authorization: `Bearer ${jwt}`,
    },
  });

  return new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
  });
};

export const withApollo = createWithApollo(createClient);
