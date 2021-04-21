import { Box, Button, Divider } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import { Comment, Post, useGetOnePostQuery } from '../../generated/graphql';
import { withApollo } from '../../utils/withApollo';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PostCard from '../../components/PostCard';
import AddComment from '../../components/AddComment';
import CommentCard from '../../components/CommentCard';
import PageLoader from '../../components/PageLoader';

const PostPage = () => {
  const router = useRouter();
  const { postId }: any = router.query;
  const { data, loading } = useGetOnePostQuery({
    skip: typeof postId === 'undefined',
    variables: { postId },
  });

  if (loading) {
    return <PageLoader />;
  } else if (!data || (data && !data.getOnePost)) {
    return (
      <Layout headTitle='Posts not found'>
        <h3>Posts not found</h3>
      </Layout>
    );
  }
  const post = data.getOnePost;

  const { user, title } = post;

  return (
    <Layout includeNavbar headTitle={`${title} | ${user.name}`}>
      <Button
        onClick={() => {
          router.push('/posts');
        }}
        style={{ marginBottom: '2rem' }}
        startIcon={<ArrowBackIcon />}
        variant='contained'
      >
        Back To Posts
      </Button>
      <PostCard post={post as Post} />
      <Box marginTop='1rem' marginBottom='1rem'>
        <AddComment postId={postId} />
      </Box>
      <Divider />
      <Box marginBottom='1rem' marginTop='1rem'>
        {post.comments.map((c) => (
          <CommentCard key={c._id} comment={c as Comment} />
        ))}
      </Box>
    </Layout>
  );
};

export default withApollo({ ssr: true })(PostPage);
