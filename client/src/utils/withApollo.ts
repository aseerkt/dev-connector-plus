import { createWithApollo } from './createWithApollo';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { NextPageContext } from 'next';
import { createUploadLink } from 'apollo-upload-client';
import { API_URL } from '../config';

const createClient = (_ctx: NextPageContext) => {
  const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    credentials: 'include',
  });

  return new ApolloClient({
    link: uploadLink as unknown as ApolloLink,
    cache: new InMemoryCache(),
  });
};

export const withApollo = createWithApollo(createClient);
