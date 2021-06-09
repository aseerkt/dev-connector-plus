import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useMeQuery } from '../generated/graphql';
import Navbar from './Navbar';
import PageLoader from './PageLoader';

const PrivatePage: React.FC = ({ children }) => {
  const { data, loading, error } = useMeQuery();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !data.me) {
      router.replace({
        pathname: `/login`,
        query: { ...router.query, next: router.pathname },
      });
    }
  }, [loading, data, error]);

  if (loading || (!loading && !data.me)) {
    return (
      <>
        <Navbar />
        <PageLoader />
      </>
    );
  }
  return <>{children}</>;
};

export default PrivatePage;
