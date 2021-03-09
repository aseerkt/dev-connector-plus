import { AppBar, Button, makeStyles, Toolbar } from '@material-ui/core';
import React from 'react';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
  titleSecondary: {
    color: '#3f3030',
  },
  navlinkContainer: {
    marginLeft: 'auto',
  },
  navButtons: {
    fontWeight: 'normal',
    marginLeft: '1rem',
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <AppBar position='fixed'>
      <Toolbar>
        <DeveloperModeIcon fontSize='large' />
        <h2 className={classes.title}>
          git<span className={classes.titleSecondary}>SHARE</span>
        </h2>
        <div className={classes.navlinkContainer}>
          <Button
            onClick={() => router.push('')}
            className={classes.navButtons}
            color='inherit'
          >
            Developers
          </Button>
          <Button
            onClick={() => router.push('/login')}
            className={classes.navButtons}
            variant='contained'
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
