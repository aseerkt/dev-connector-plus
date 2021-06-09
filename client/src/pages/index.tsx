import { Button, Container, makeStyles, useTheme } from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import PageLoader from '../components/PageLoader';
import { useMeQuery } from '../generated/graphql';
import { withApollo } from '../utils/withApollo';

const useStyles = makeStyles((theme) => ({
  landing: {
    position: 'relative',
    background: 'url("/img/showcase.jpg") no-repeat center center/cover',
    height: '100vh',
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  landingInner: {
    color: '#fff',
    height: '100%',
    width: '80%',
    margin: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  title: {
    display: 'flex',
    fontSize: '4rem',
    justifyContent: 'center',
    marginBottom: '5px',
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: '2rem',
      marginTop: '5rem',
    },
  },
  titleSHARE: {
    color: '#6b6161',
  },
  tagText: {
    fontSize: '1.1rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

function Home() {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  const classes = useStyles();
  const isSm = useTheme().breakpoints.down('sm');

  console.log({ isSm });

  if (loading) {
    return <PageLoader info='...' />;
  } else if (data && !data.me) {
    return (
      <div>
        <Head>
          <title>DevConnector+</title>
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <Navbar />
        <section className={classes.landing}>
          <div className={classes.darkOverlay}>
            <div className={classes.landingInner}>
              <Container maxWidth='md'>
                <h1 className={classes.title}>
                  <span>
                    Dev<span className={classes.titleSHARE}>Connector</span> +
                  </span>
                </h1>
                <p className={classes.tagText}>
                  Create a developer profile/portfolio, share posts and get help
                  from other developers
                </p>
                <div className={classes.buttons}>
                  <Button
                    size='large'
                    onClick={() => router.push('/login')}
                    variant='contained'
                  >
                    Login
                  </Button>
                  <Button
                    size='large'
                    onClick={() => router.push('/register')}
                    color='secondary'
                    variant='contained'
                  >
                    Sign Up
                  </Button>
                </div>
              </Container>
            </div>
          </div>
        </section>
      </div>
    );
  } else if (data && data.me) {
    router.push('/dashboard');
    return <PageLoader />;
  }
}

export default withApollo({ ssr: false })(Home);
