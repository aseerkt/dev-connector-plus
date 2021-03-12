import { TextField } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import React, { useState } from 'react';
import FormWrapper from '../components/FormWrapper';
import { getUserFromServer } from '../utils/getUserFromServer';
const ReactQuill =
  typeof window === 'object' ? require('react-quill') : () => false;

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        />

        <ReactQuill theme='snow' value={body} onChange={setBody} />
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
