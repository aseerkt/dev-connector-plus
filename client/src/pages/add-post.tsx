import { Button, FormLabel, makeStyles, TextField } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import PostAddIcon from '@material-ui/icons/PostAdd';
import FormWrapper from '../components/FormWrapper';
import { useAddPostMutation } from '../generated/graphql';
import { getUserFromServer } from '../utils/getUserFromServer';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

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
          if (data.addPost.post) {
            cache.evict({ fieldName: 'getAllPosts' });
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromServer(req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: {} };
};

export default AddPost;
