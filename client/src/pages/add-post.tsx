import { Button, FormLabel, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import FormWrapper from '../components/FormWrapper';
import { useAddPostMutation } from '../generated/graphql';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { withApollo } from '../utils/withApollo';
import { useIsAuth } from '../utils/useIsAuth';

const Quill = dynamic(import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const useStyles = makeStyles({
  titleInput: {
    marginBottom: '1rem',
  },
  bodyInputLable: {
    marginBottom: '1rem',
  },
  submitButton: {
    marginTop: '1rem',
  },
});

const AddPost = () => {
  useIsAuth();
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const [addPost] = useAddPostMutation();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await addPost({
        variables: { title, body },
        update: (cache, { data }) => {
          const newPost = data.addPost.post;
          if (newPost) {
            cache.modify({
              fields: {
                getPosts(existingPostRefs = [], { readField }) {
                  const newPostRef = cache.writeFragment({
                    data: newPost,
                    fragment: gql`
                      fragment NewPost on Post {
                        _id
                        createdAt
                        updatedAt
                        title
                        body
                        likeCount
                        dislikeCount
                        userLike
                        user {
                          _id
                          name
                          email
                          avatar
                        }
                      }
                    `,
                  });

                  // Quick safety check - if the new Post is already
                  // present in the cache, we don't need to add it again.
                  if (
                    existingPostRefs.some(
                      (ref) => readField('_id', ref) === newPost._id
                    )
                  ) {
                    return existingPostRefs;
                  }

                  return [newPostRef, ...existingPostRefs];
                },
              },
            });
            router.push('/posts');
          }
        },
      });
      const { errors } = res.data.addPost;
      if (errors) setTitleError(errors[0].message);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };
  return (
    <FormWrapper
      w='md'
      title='Add Post'
      formTitle='Add some relevant posts to stand out from the crowd'
      includeNavbar
    >
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          label='Title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant='outlined'
          className={classes.titleInput}
          error={!!titleError}
          helperText={titleError}
        />
        <FormLabel className={classes.bodyInputLable}>Body</FormLabel>
        <Quill theme='snow' value={body} onChange={setBody} />
        <Button
          type='submit'
          disabled={loading || !title || !body}
          className={classes.submitButton}
          variant='contained'
          color='primary'
          startIcon={<PostAddIcon />}
        >
          Add Post
        </Button>
      </form>
    </FormWrapper>
  );
};

export default withApollo({ ssr: false })(AddPost);
