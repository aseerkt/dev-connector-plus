import NextLink from 'next/link';
import { Form, Formik } from 'formik';
// import * as yup from 'yup';
import { Button, makeStyles, Link } from '@material-ui/core';
import { PersonAdd } from '@material-ui/icons';
import InputField from '../components/InputField';
import { useRegisterMutation, MeDocument, MeQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { extractFormErrors } from '../utils/extractFormErrors';
import FormWrapper from '../components/FormWrapper';

// const validationSchema = yup.object({
//   name: yup
//     .string()
//     .min(3, 'Name should be of minimum of 3 characters length')
//     .required('Name is requiredddd')
//     .nullable(),
//   email: yup
//     .string()
//     .email('Enter a valid email')
//     .required('Email is required')
//     .nullable(),
//   password: yup
//     .string()
//     .min(6, 'Password should be of minimum 6 characters length')
//     .required('Password is required')
//     .nullable(),
// });

const useStyles = makeStyles((theme) => ({
  form: {
    marginBottom: '1rem',
  },
}));

const Register = () => {
  const router = useRouter();
  const classes = useStyles();
  const [register] = useRegisterMutation();
  return (
    <FormWrapper w='sm' title='Sign Up' formTitle='Create Your Account'>
      <Formik
        initialValues={{ name: '', email: '', password: '' }}
        // {...validationSchema}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
          try {
            const res = await register({
              variables: values,
              update: (cache, { data }) => {
                const user = data.register.user;
                if (user) {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: { me: user },
                  });
                  router.push('/login');
                }
              },
            });
            const { errors } = res.data.register;
            if (errors) {
              // console.log(errors);
              setErrors(extractFormErrors(errors));
            }
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <InputField name='name' label='Name' />
            <InputField autoComplete='username' name='email' label='Email' />
            <InputField
              type='password'
              autoComplete='current-password'
              name='password'
              label='Password'
            />
            <Button
              startIcon={<PersonAdd />}
              disabled={isSubmitting}
              color='primary'
              variant='contained'
              type='submit'
            >
              Sign up
            </Button>
          </Form>
        )}
      </Formik>
      <small>
        Already have an account?{' '}
        <NextLink href='/login'>
          <Link href='#'>Log In</Link>
        </NextLink>
      </small>
    </FormWrapper>
  );
};

export default Register;
