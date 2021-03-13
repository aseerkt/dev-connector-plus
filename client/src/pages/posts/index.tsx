import { GetServerSideProps } from 'next';
import { addApolloState, initializeApollo } from '../../utils/withApollo';
import {
  GetPostsQuery,
  GetPostsDocument,
  useGetPostsQuery,
  useMeQuery,
  Post,
} from '../../generated/graphql';
import Layout from '../../components/Layout';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Button, makeStyles } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PostCard from '../../components/PostCard';

const useStyles = makeStyles((theme) => ({
  addPostButton: {
    marginBottom: '2rem',
  },
}));

const Posts = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const router = useRouter();
  const { data: meData } = useMeQuery();
  const {
    data: { getPosts: posts },
  } = useGetPostsQuery();

  return (
    <Layout
      headTitle='Posts'
      title='Posts'
      subTitle='Welcome to the community!'
      includeNavbar
      Icon={InsertDriveFileIcon}
    >
      <Button
        className={classes.addPostButton}
        onClick={() => {
          router.push('/add-post');
        }}
        startIcon={<PostAddIcon />}
        variant='contained'
        color='primary'
      >
        Add Post
      </Button>
      {posts.map((post) => (
        <PostCard key={post._id} post={post as Post} />
      ))}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo();

  const profileRes = await apolloClient.query<GetPostsQuery>({
    query: GetPostsDocument,
    context: {
      headers: {
        cookie: req.headers.cookie,
      },
    },
  });
  const posts = profileRes.data.getPosts;
  return addApolloState(apolloClient, { props: {} });
};

export default Posts;
