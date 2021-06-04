import React from 'react';
import PersonPinCircleIcon from '@material-ui/icons/PersonPinCircle';
import { Button, Link, makeStyles } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import FormWrapper from '../components/FormWrapper';
import { extractFormErrors } from '../utils/extractFormErrors';
import InputField from '../components/InputField';
import { withApollo } from '../utils/withApollo';

const useStyles = makeStyles((theme) => ({
  form: {
    marginBottom: '1rem',
  },
}));

const Login = () => {
  const router = useRouter();
  const classes = useStyles();
  const [login] = useLoginMutation();
  return (
    <FormWrapper
      w='sm'
      title='Login'
      formTitle='Sign into Your Account'
      FormTitleIcon={PersonPinCircleIcon}
    >
      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const res = await login({
              variables: values,
              update: async (cache, { data }) => {
                const user = data.login.user;
                if (user) {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: { me: user },
                  });
                  router.push('/dashboard');
                }
              },
            });
            const { errors } = res.data.login;
            if (errors) {
              setErrors(extractFormErrors(errors));
            }
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting, values: { email, password } }) => (
          <Form className={classes.form}>
            <InputField name='email' label='Email' />
            <InputField type='password' name='password' label='Password' />
            <Button
              type='submit'
              disabled={isSubmitting || !email || !password}
              color='primary'
              variant='contained'
            >
              Log In
            </Button>
          </Form>
        )}
      </Formik>
      <small>
        Don't have an account?{' '}
        <NextLink href='/register'>
          <Link href='#'>Sign Up</Link>
        </NextLink>
      </small>
    </FormWrapper>
  );
};

export default withApollo({ ssr: false })(Login);
