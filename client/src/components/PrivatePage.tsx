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
      if (router.query === {}) {
        router.replace(`/login?next=${router.pathname}`);
      } else {
        router.replace(`/login`);
      }
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
