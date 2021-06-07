import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  Hidden,
  IconButton,
  makeStyles,
  Toolbar,
} from '@material-ui/core';
import React from 'react';
import PersonIcon from '@material-ui/icons/Person';
import { useRouter } from 'next/router';
import { useLogoutMutation, useMeQuery } from '../generated/graphql';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Logo from './Logo';
import { Person, PersonAdd } from '@material-ui/icons';

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginRight: 'auto',
    },
  },
  navButtons: {
    fontWeight: 'normal',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
    padding: '0.5rem',
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

  const logoutUser = async () => {
    logout({
      update: (cache, { data }) => {
        if (data.logout) cache.reset();
      },
    });
  };

  const authLinks = (
    <>
      <Hidden smDown>
        <Button
          startIcon={<PersonIcon />}
          onClick={() => router.push('/dashboard')}
          className={classes.navButtons}
          color='inherit'
        >
          Dashboard
        </Button>
      </Hidden>
      <Hidden smUp>
        <IconButton
          onClick={() => router.push('/dashboard')}
          className={classes.navButtons}
          aria-label='Logout'
        >
          <PersonIcon />
        </IconButton>
      </Hidden>
      <Hidden smDown>
        <Button
          className={classes.navButtons}
          startIcon={<ExitToAppIcon />}
          variant='contained'
          onClick={logoutUser}
        >
          Logout
        </Button>
      </Hidden>
      <Hidden smUp>
        <IconButton
          onClick={logoutUser}
          className={classes.navButtons}
          aria-label='Logout'
        >
          <ExitToAppIcon />
        </IconButton>
      </Hidden>
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
      <Hidden smDown>
        <Button
          startIcon={<PersonAdd />}
          onClick={() => router.push('/register')}
          className={classes.navButtons}
          color='secondary'
          variant='contained'
        >
          Sign Up
        </Button>
      </Hidden>
      <Hidden smUp>
        <IconButton
          onClick={() => router.push('/register')}
          aria-label='Sign Up'
        >
          <PersonAdd />
        </IconButton>
      </Hidden>
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
