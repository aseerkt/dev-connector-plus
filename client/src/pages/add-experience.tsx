import { Box, Button } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import { CheckboxWithLabel } from 'formik-material-ui';
import { GetServerSideProps, NextPage } from 'next';
import {
  MyProfileQuery,
  MyProfileDocument,
  useAddExpMutation,
} from '../generated/graphql';
import { getUserFromServer } from '../utils/getUserFromServer';
import { initializeApollo, addApolloState } from '../utils/withApollo';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { extractFormErrors } from '../utils/extractFormErrors';

const AddExperience: NextPage<{ profileId: string }> = ({ profileId }) => {
  const router = useRouter();
  const [addExp] = useAddExpMutation();
  return (
    <FormWrapper
      includeNavbar
      w='md'
      title='Add Experience'
      formTitle='Add any developer/programming
        positions that you have had in the past'
    >
      <Formik
        initialValues={{
          title: '',
          company: '',
          location: '',
          from: '',
          to: '',
          current: false,
          description: '',
        }}
        onSubmit={async (values, action) => {
          // console.log(values);
          try {
            const res = await addExp({
              variables: { expInput: values },
              update: (cache, { data }) => {
                const newExperience = data.addExperience.experience;
                if (newExperience) {
                  cache.modify({
                    id: 'Profile:' + profileId,
                    broadcast: false,
                    fields: {
                      experiences(existingExperienceRefs = [], { readField }) {
                        const newExperienceRef = cache.writeFragment({
                          fragment: gql`
                            fragment NewExperience on Experience {
                              _id
                              title
                              company
                              location
                              from
                              to
                              current
                              description
                            }
                          `,
                          data: newExperience,
                        });

                        // Quick safety check - if the new Experience is already
                        // present in the cache, we don't need to add it again.
                        if (
                          existingExperienceRefs.some(
                            (ref) => readField('_id', ref) === newExperience._id
                          )
                        ) {
                          return existingExperienceRefs;
                        }

                        return [newExperienceRef, ...existingExperienceRefs];
                      },
                    },
                  });
                  router.push('/dashboard');
                }
              },
            });
            const { errors } = res.data.addExperience;
            if (errors) {
              action.setErrors(extractFormErrors(errors));
            }
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <InputField name='title' label='Job Title*' />
            <InputField name='company' label='Company*' />
            <InputField name='location' label='Location' />
            <InputField type='date' name='from' label='From Date*' />
            <Box marginBottom='1.3rem'>
              <Field
                component={CheckboxWithLabel}
                type='checkbox'
                name='current'
                onChange={() => {
                  setValues({ ...values, to: '', current: !values.current });
                }}
                Label={{
                  label: 'Current Job',
                }}
              />
            </Box>
            <InputField
              id='todate'
              disabled={values.current}
              type='date'
              name='to'
              label='To Date'
            />
            {/* <InputField
              type='checkbox'
              name='current'
              label='Current School or Bootcamp'
            /> */}

            <InputField multiple name='description' label='Job Description' />
            <Button
              disabled={isSubmitting}
              type='submit'
              variant='contained'
              color='primary'
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo();
  const user = await getUserFromServer(req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const profileRes = await apolloClient.query<MyProfileQuery>({
    query: MyProfileDocument,
    context: { headers: { cookie: req.headers.cookie } },
  });
  // console.log(profileRes);
  const profile = profileRes.data.myProfile;
  if (!profile || profile.user._id != user._id) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }
  return addApolloState(apolloClient, {
    props: { user, profileId: profile._id },
  });
};

export default AddExperience;
