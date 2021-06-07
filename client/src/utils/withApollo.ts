import { createWithApollo } from './createWithApollo';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { NextPageContext } from 'next';
import { createUploadLink } from 'apollo-upload-client';
import { API_URL } from '../config';

const createClient = (_ctx: NextPageContext) => {
  const uploadLink = createUploadLink({
    uri: `${API_URL}/graphql`,
    credentials: 'include',
  });

  const errorLink = onError(({ graphQLErrors, response, operation }) => {
    if (graphQLErrors && graphQLErrors[0].message === 'Not Authenticated') {
      console.log('Caught the culprit');
      response.errors = null;
    }
  });

  return new ApolloClient({
    link: ApolloLink.from([errorLink, uploadLink as any]),
    cache: new InMemoryCache(),
  });
};

export const withApollo = createWithApollo(createClient);
