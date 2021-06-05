import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  Hidden,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      paddingLeft: 0,
      paddingRight: 0,
      paddingBottom: '1rem',
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
    [theme.breakpoints.down('sm')]: {
      marginRight: 'auto',
    },
  },
  navButtons: {
    fontWeight: 'normal',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.8rem',
      marginLeft: 0,
      marginRight: 0,
    },
  },
}));

const Navbar = () => {
  const { data: meData, loading } = useMeQuery();
  const router = useRouter();
  const classes = useStyles();

  const [logout] = useLogoutMutation();

  const authLinks = (
    <>
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
          logout({
            update: (cache, { data }) => {
              if (data.logout) cache.reset();
            },
          });
        }}
      >
        <Hidden smDown>Logout</Hidden>
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
            <Button
              onClick={() => router.push('/posts')}
              className={classes.navButtons}
              color='inherit'
            >
              Posts
            </Button>{' '}
            |
            {loading ? (
              <Button className={classes.navButtons} color='inherit'>
                <CircularProgress />
              </Button>
            ) : meData && meData.me ? (
              authLinks
            ) : (
              guestLinks
            )}
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
