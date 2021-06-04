import { Card, Container, makeStyles } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import Head from 'next/head';
import React from 'react';
import Logo from './Logo';
import Navbar from './Navbar';

interface FormWrapperProps {
  w: 'sm' | 'md';
  title: string;
  formTitle: string;
  FormTitleIcon?: typeof PersonIcon;
  includeNavbar?: boolean;
}

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.dark,
    fontWeight: 'bold',
    fontSize: '2rem',
  },
  card: {
    padding: '2rem',
    marginTop: '5rem',
  },
  formTitleBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  formTitleText: {
    marginLeft: '0.5rem',
  },
}));

const FormWrapper: React.FC<FormWrapperProps> = ({
  children,
  w,
  title,
  formTitle,
  FormTitleIcon = PersonIcon,
  includeNavbar = false,
}) => {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {includeNavbar && <Navbar />}
      <Container maxWidth={w}>
        <Card elevation={2} className={classes.card}>
          {w === 'sm' && <Logo />}
          <h1 className={classes.title}>{title}</h1>
          <div className={classes.formTitleBox}>
            <FormTitleIcon />
            <p className={classes.formTitleText}>{formTitle}</p>
          </div>
          {children}
        </Card>
      </Container>
    </>
  );
};

export default FormWrapper;
