import { Box, Button, Divider, makeStyles } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import {
  Comment,
  GetOnePostDocument,
  GetOnePostQuery,
  Post,
  useGetOnePostQuery,
} from '../../generated/graphql';
import { addApolloState, initializeApollo } from '../../utils/withApollo';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import PostCard from '../../components/PostCard';
import AddComment from '../../components/AddComment';
import CommentCard from '../../components/CommentCard';

const PostPage = () => {
  const router = useRouter();
  // const classes = useStyles();
  const { postId }: any = router.query;
  const {
    data: { getOnePost: post },
  } = useGetOnePostQuery({
    variables: { postId },
  });

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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const apolloClient = initializeApollo();
  const { postId } = query;
  const postRes = await apolloClient.query<GetOnePostQuery>({
    query: GetOnePostDocument,
    variables: { postId },
  });
  const post = postRes.data.getOnePost;
  if (!post) {
    return {
      redirect: {
        destination: '/posts',
        permanent: false,
      },
    };
  }
  return addApolloState(apolloClient, { props: {} });
};

export default PostPage;
