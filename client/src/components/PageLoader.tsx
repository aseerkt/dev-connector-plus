import { LinearProgress, makeStyles } from '@material-ui/core';
import Logo from './Logo';

const useStyles = makeStyles((theme) => ({
  pageLoader: {
    display: 'grid',
    placeItems: 'center',
    width: '100vw',
    height: '100vh',
    zIndex: 100,
    '& p': {
      textAlign: 'center',
    },
  },
}));

const PageLoader: React.FC<{ info?: string }> = ({ info }) => {
  const classes = useStyles();
  return (
    <div className={classes.pageLoader}>
      <div>
        <Logo />
        <LinearProgress />
        <p>Loading {info}</p>
      </div>
    </div>
  );
};

export default PageLoader;
