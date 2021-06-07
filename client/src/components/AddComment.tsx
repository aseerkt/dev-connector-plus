import { gql } from '@apollo/client';
import { Form, Formik } from 'formik';
import React from 'react';
import { useAddCommentMutation, useMeQuery } from '../generated/graphql';
import InputField from './InputField';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Button } from '@material-ui/core';

interface AddCommentProps {
  postId: string;
}

const AddComment: React.FC<AddCommentProps> = ({ postId }) => {
  const [addComment] = useAddCommentMutation();
  const { data } = useMeQuery();

  if (data && !data.me) {
    return null;
  }
  return (
    <>
      <Formik
        initialValues={{ text: '' }}
        onSubmit={async ({ text }) => {
          await addComment({
            variables: { postId, text },
            update: (cache, { data }) => {
              const newComment = data.addComment;
              if (newComment) {
                cache.modify({
                  id: 'Post:' + postId,
                  fields: {
                    comments(existingCommentRefs = [], { readField }) {
                      const newCommentRef = cache.writeFragment({
                        data: newComment,
                        fragment: gql`
                          fragment NewComment on Comment {
                            createdAt
                            updatedAt
                            text
                            user {
                              _id
                              name
                              email
                              avatar
                            }
                          }
                        `,
                      });

                      // Quick safety check - if the new comment is already
                      // present in the cache, we don't need to add it again.
                      if (
                        existingCommentRefs.some(
                          (ref) => readField('_id', ref) === newComment._id
                        )
                      ) {
                        return existingCommentRefs;
                      }

                      return [newCommentRef, ...existingCommentRefs];
                    },
                  },
                });
              }
            },
          });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name='text' label='Leave a comment...' multiple />
            <Button
              disabled={isSubmitting}
              startIcon={<AddCircleOutlineIcon />}
              variant='contained'
              color='primary'
              type='submit'
            >
              Comment
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AddComment;
