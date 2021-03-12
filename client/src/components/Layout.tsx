import { makeStyles, SvgIconTypeMap, Container } from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import Navbar from './Navbar';
import PersonIcon from '@material-ui/icons/Person';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

interface LayoutProps {
  includeNavbar?: boolean;
  headTitle: string;
  title?: string;
  subTitle?: string;
  Icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: '6.3rem',
  },
  title: {
    color: theme.palette.primary.light,
    fontWeight: 'bold',
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  subTitle: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    marginTop: '1rem',
    fontSize: '1.6rem',
    fontWeight: 500,
  },
}));

const Layout: React.FC<LayoutProps> = ({
  includeNavbar = false,
  title,
  headTitle,
  subTitle,
  Icon = PersonIcon,
  children,
}) => {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>{headTitle}</title>
      </Head>
      {includeNavbar && <Navbar />}
      <Container maxWidth='md' className={classes.container}>
        {title && <h1 className={classes.title}>{title}</h1>}
        {subTitle && (
          <p className={classes.subTitle}>
            <Icon fontSize='large' />{' '}
            <span style={{ marginLeft: '.5rem' }}>{subTitle}</span>
          </p>
        )}
        {children}
      </Container>
    </>
  );
};

export default Layout;