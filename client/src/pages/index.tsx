import { Button, makeStyles } from '@material-ui/core';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';

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
  },
  title: {
    fontSize: '3rem',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  titleSHARE: {
    color: '#6b6161',
  },
  title2: {
    fontSize: '2rem',
    marginBottom: '0.1rem',
    fontWeight: 'bold',
  },
  buttons: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Home() {
  const router = useRouter();
  const classes = useStyles();
  return (
    <div>
      <Head>
        <title>gitSHARE: Home</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Navbar />
      <section className={classes.landing}>
        <div className={classes.darkOverlay}>
          <div className={classes.landingInner}>
            <h1 className={classes.title}>
              git<span className={classes.titleSHARE}>SHARE</span>
            </h1>
            <p>
              Create a developer profile/portfolio, share posts and get help
              from other developers
            </p>
            <div className={classes.buttons}>
              <Button onClick={() => router.push('/login')} variant='contained'>
                Login
              </Button>
              <Button
                onClick={() => router.push('/register')}
                color='secondary'
                variant='contained'
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
