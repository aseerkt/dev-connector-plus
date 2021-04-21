import { Box, Button } from '@material-ui/core';
import { CheckboxWithLabel } from 'formik-material-ui';
import { Field, Form, Formik } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import { useRouter } from 'next/router';
import { useAddEduMutation, useMyProfileQuery } from '../generated/graphql';
import { gql } from '@apollo/client';
import { extractFormErrors } from '../utils/extractFormErrors';
import { withApollo } from '../utils/withApollo';

const AddEducation: NextPage<{ profileId: string }> = ({ profileId }) => {
  const router = useRouter();
  const [addEdu] = useAddEduMutation();

  const { data, loading } = useMyProfileQuery();

  return (
    <FormWrapper
      includeNavbar
      w='md'
      title='Add Education'
      formTitle='Add any school, bootcamp, etc that
        you have attended'
    >
      <Formik
        initialValues={{
          school: '',
          degree: '',
          fieldofstudy: '',
          from: '',
          to: '',
          current: false,
          description: '',
        }}
        onSubmit={async (values, action) => {
          // console.log(values);
          try {
            const res = await addEdu({
              variables: { eduInput: values },
              update: (cache, { data }) => {
                const newEducation = data.addEducation.education;
                cache.modify({
                  id: 'Profile:' + profileId,
                  broadcast: false,
                  fields: {
                    educations(existingEducationRefs = [], { readField }) {
                      const newEducationRef = cache.writeFragment({
                        fragment: gql`
                          fragment NewEducation on Education {
                            _id
                            school
                            degree
                            fieldofstudy
                            from
                            to
                            current
                            description
                          }
                        `,
                        data: newEducation,
                      });

                      // Quick safety check - if the new Education is already
                      // present in the cache, we don't need to add it again.
                      if (
                        existingEducationRefs.some(
                          (ref) => readField('_id', ref) === newEducation._id
                        )
                      ) {
                        return existingEducationRefs;
                      }

                      return [newEducationRef, ...existingEducationRefs];
                    },
                  },
                });
                router.push('/dashboard');
              },
            });
            const { errors } = res.data.addEducation;
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
            <InputField name='school' label='School or Bootcamp*' />
            <InputField name='degree' label='Degree or Certificate*' />
            <InputField name='fieldofstudy' label='Field of Study*' />
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
                  label: 'Current School or Bootcamp',
                }}
              />
            </Box>
            <InputField
              id='todate'
              disabled={values.current}
              value={values.current ? '' : values.to}
              type='date'
              name='to'
              label='To Date'
            />
            {/* <InputField
              type='checkbox'
              name='current'
              label='Current School or Bootcamp'
            /> */}

            <InputField
              multiple
              name='description'
              label='Program Description'
            />
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

export default withApollo({ ssr: true })(AddEducation);
