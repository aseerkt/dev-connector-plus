import {
  AppBar,
  Button,
  Container,
  Hidden,
  Link,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import React from 'react';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import PersonIcon from '@material-ui/icons/Person';
import { useRouter } from 'next/router';
import {
  useMeQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from '../generated/graphql';
import { useApolloClient } from '@apollo/client';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Logo from './Logo'

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  titleSecondary: {
    color: '#3f3030',
  },
  navlinkContainer: {
    marginLeft: 'auto',
    [theme.breakpoints.down('sm')]: {},
  },
  navButtons: {
    fontWeight: 'normal',
    marginLeft: '1rem',
  },
}));

const Navbar = () => {
  const { data: meData, loading } = useMeQuery();
  const [logout] = useLogoutMutation();
  const client = useApolloClient();
  const router = useRouter();
  const classes = useStyles();

  const authLinks = (
    <>
      <Button
        onClick={() => router.push('/posts')}
        className={classes.navButtons}
        color='inherit'
      >
        Posts
      </Button>
      <Button
        startIcon={<PersonIcon />}
        onClick={() => router.push('/dashboard')}
        className={classes.navButtons}
        color='inherit'
      >
        <Hidden smDown>Dashboard</Hidden>
      </Button>
      <Button
        className={classes.navButtons}
        startIcon={<ExitToAppIcon />}
        variant='contained'
        onClick={async () => {
          await logout({
            update: (cache, { data }) => {
              if (data.logout) {
                client.resetStore();
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: { me: null },
                });
                router.push('/');
              }
            },
          });
        }}
      >
        Logout
      </Button>
    </>
  );
  const guestLinks = (
    <>
      <Button
        onClick={() => router.push('/login')}
        className={classes.navButtons}
        color='inherit'
      >
        Login
      </Button>
      <Button
        onClick={() => router.push('/register')}
        className={classes.navButtons}
        color='secondary'
        variant='contained'
      >
        Sign Up
      </Button>
    </>
  );

  return (
    <AppBar position='fixed'>
      <Container maxWidth='lg'>
        <Toolbar className={classes.toolbar}>
          <Logo />

          <div className={classes.navlinkContainer}>
            <Button
              onClick={() => router.push('/profiles')}
              className={classes.navButtons}
              color='inherit'
            >
              Developers
            </Button>
            {!loading && (meData && meData.me ? authLinks : guestLinks)}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
