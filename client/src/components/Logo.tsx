import { makeStyles } from '@material-ui/core';
import React from 'react';
import DeveloperModeIcon from '@material-ui/icons/DeveloperMode';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    flexGrow: 1,
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  titleSecondary: {
    color: '#3f3030',
  },
}));

const Logo = () => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <div className={classes.logoContainer}>
      <DeveloperModeIcon fontSize='large' />

      <h2
        onClick={() => {
          router.push('/');
        }}
        className={classes.title}
      >
        Dev<span className={classes.titleSecondary}>Connector</span>
      </h2>
    </div>
  );
};

export default Logo;
