import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageLoader from '../components/PageLoader';
import { useMeQuery } from '../generated/graphql';

export const useIsAuth = () => {
  const { data, loading, error } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data.me) {
      router.replace('/login?next=' + router.pathname);
    }
  }, [loading, data, error]);

  return { meData: data, loading };
};
