import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { addApolloState, initializeApollo } from '../../utils/withApollo';
import { GetPostsQuery, GetPostsDocument, Post } from '../../generated/graphql';
import Layout from '../../components/Layout';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Box, Button, makeStyles } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Image from 'next/image';
import { formatAvatarUrl } from '../../utils/formatAvatarUrl';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  avataImage: {
    position: 'relative',
    height: '10rem',
    width: '10rem',
    borderRadius: '50%',
    overflow: 'hidden',
  },
}));

const Posts: NextPage<{ posts: Post[] }> = ({ posts }) => {
  const classes = useStyles();
  const router = useRouter();

  return (
    <Layout
      headTitle='Posts'
      title='Posts'
      subTitle='Welcome to the community!'
      includeNavbar
      Icon={InsertDriveFileIcon}
    >
      <Button
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
        <Box key={post._id} marginBottom='1rem'>
          <div className={classes.avataImage}>
            <Image
              src={formatAvatarUrl(post.user.avatar)}
              alt={post.user.name}
              layout='fill'
              objectFit='cover'
            />
          </div>
        </Box>
      ))}
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({}) => {
  const apolloClient = initializeApollo();

  const profileRes = await apolloClient.query<GetPostsQuery>({
    query: GetPostsDocument,
  });
  const posts = profileRes.data.getPosts;
  return addApolloState(apolloClient, { props: { posts } });
};

export default Posts;
