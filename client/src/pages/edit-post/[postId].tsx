import { Button, FormLabel, makeStyles, TextField } from '@material-ui/core';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import EditIcon from '@material-ui/icons/Edit';
import FormWrapper from '../../components/FormWrapper';
import {
  useEditPostMutation,
  useGetOnePostQuery,
} from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';
import PageLoader from '../../components/PageLoader';
import Layout from '../../components/Layout';

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

const EditPost = () => {
  const classes = useStyles();
  const router = useRouter();

  const postId = router.query.postId as string;
  const { data: postData, loading: postLoading } = useGetOnePostQuery({
    skip: typeof postId === 'undefined',
    variables: { postId },
  });

  if (postLoading) {
    return <PageLoader />;
  } else if (!postData || (postData && !postData.getOnePost)) {
    return (
      <Layout headTitle='Post not found'>
        <h3>Post not found</h3>
      </Layout>
    );
  }

  const post = postData.getOnePost;

  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);
  const [titleError, setTitleError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editPost] = useEditPostMutation();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await editPost({
        variables: { title, body, postId },
        update: (cache, { data }) => {
          if (data.editPost.post) {
            cache.evict({ id: 'Post:' + postId });
            router.push('/posts');
          }
        },
      });
      const { errors } = res.data.editPost;
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
      title='Edit Post'
      formTitle='Keep your post clean and relevant'
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
          startIcon={<EditIcon />}
        >
          Edit Post
        </Button>
      </form>
    </FormWrapper>
  );
};

export default withApollo({ ssr: false })(EditPost);
