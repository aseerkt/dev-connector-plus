import { Box, Button } from '@material-ui/core';
import { Field, Form, Formik } from 'formik';
import React from 'react';
import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import { CheckboxWithLabel } from 'formik-material-ui';
import { useAddExpMutation, useMyProfileQuery } from '../generated/graphql';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { extractFormErrors } from '../utils/extractFormErrors';
import { withApollo } from '../utils/withApollo';
import PageLoader from '../components/PageLoader';
import Layout from '../components/Layout';

const AddExperience = () => {
  const router = useRouter();
  const [addExp] = useAddExpMutation();

  let profileId = null;

  const { data, loading } = useMyProfileQuery();
  if (loading) {
    return <PageLoader />;
  } else if (!data || (data && !data.myProfile)) {
    return (
      <Layout headTitle='No Profile found'>
        <h3>You have not setup any profile to add education onto</h3>
      </Layout>
    );
  }
  profileId = data.myProfile._id;
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

export default withApollo({ ssr: false })(AddExperience);
