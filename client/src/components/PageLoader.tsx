import { LinearProgress, makeStyles, StylesProvider } from '@material-ui/core';
import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  pageLoader: {
    display: 'grid',
    placeItems: 'center',
    width: '100vw',
    height: '100vh',
  },
}));

const PageLoader = () => {
  const classes = useStyles();
  return (
    <div className={classes.pageLoader}>
      <Logo />
      <LinearProgress />
    </div>
  );
};

export default PageLoader;
