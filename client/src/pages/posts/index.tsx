import { GetServerSideProps, NextPage } from 'next';
import React from 'react';
import { addApolloState, initializeApollo } from '../../utils/withApollo';
import {
  GetPostsQuery,
  GetPostsDocument,
  Post,
  useToggleLikeMutation,
  useGetPostsQuery,
} from '../../generated/graphql';
import Layout from '../../components/Layout';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Image from 'next/image';
import { formatAvatarUrl } from '../../utils/formatAvatarUrl';
import { useRouter } from 'next/router';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ChatIcon from '@material-ui/icons/Chat';
import { gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  addPostButton: {
    marginBottom: '2rem',
  },
  avatarImage: {
    position: 'relative',
    height: '10rem',
    width: '10rem',
    borderRadius: '50%',
    overflow: 'hidden',
  },
}));

const Posts = () => {
  const classes = useStyles();
  const router = useRouter();
  const [toggleLike, { loading }] = useToggleLikeMutation();
  const {
    data: { getPosts: posts },
  } = useGetPostsQuery();

  const likeAction = async (
    postId: string,
    value: 1 | -1,
    likeCount: number,
    dislikeCount: number,
    userLike: number | null
  ) => {
    try {
      await toggleLike({
        variables: { postId, value },
        update: (cache, { data }) => {
          if (data.toggleLike) {
            const fragment = gql`
              fragment NewLike on Post {
                likeCount
                dislikeCount
                userLike
              }
            `;
            let newLikeCount = likeCount;
            let newDislikeCount = dislikeCount;
            let newUserLike: number;

            if (userLike == value) {
              // user clicked liked/disliked again
              newUserLike = null;
              if (value === 1) newLikeCount += -1;
              else newDislikeCount += -1;
            } else if (!userLike) {
              // user not liked or disliked before
              newUserLike = value;
              if (value === 1) newLikeCount += 1;
              else newDislikeCount += 1;
            } else {
              // user switched from like/dislike to dislike/like
              newUserLike = value;
              if (value === 1) {
                newLikeCount += 1;
                newDislikeCount += -1;
              } else {
                newDislikeCount += 1;
                newLikeCount += -1;
              }
            }
            console.log(value, newUserLike, newLikeCount, newDislikeCount);
            cache.writeFragment({
              fragment,
              id: 'Post:' + postId,
              data: {
                likeCount: newLikeCount,
                dislikeCount: newDislikeCount,
                userLike: newUserLike,
              },
            });
          }
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

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
        <Box
          key={post._id}
          display='flex'
          width='100%'
          border='1px solid #979494'
          borderRadius='2rem'
          padding='2rem'
          marginBottom='3rem'
        >
          <Box>
            <div className={classes.avatarImage}>
              <Image
                src={formatAvatarUrl(post.user.avatar)}
                layout='fill'
                objectFit='cover'
              />
            </div>
            <p>{post.user.name}</p>
          </Box>
          <Box
            flex={1}
            display='flex'
            justifyContent='space-between'
            alignItems='center'
            paddingLeft='2.5rem'
          >
            <Box>
              <Typography variant='h5' paragraph>
                {post.title}
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: post.body }}></div>
              <Button
                disabled={loading}
                onClick={() => {
                  likeAction(
                    post._id,
                    1,
                    post.likeCount,
                    post.dislikeCount,
                    post.userLike
                  );
                }}
                startIcon={<ThumbUpIcon />}
                variant={post.userLike === 1 ? 'contained' : 'outlined'}
                color='primary'
              >
                {post.likeCount}
              </Button>
              <Button
                disabled={loading}
                onClick={() => {
                  likeAction(
                    post._id,
                    -1,
                    post.likeCount,
                    post.dislikeCount,
                    post.userLike
                  );
                }}
                startIcon={<ThumbDownIcon />}
                variant={post.userLike === -1 ? 'contained' : 'outlined'}
                color='primary'
              >
                {post.dislikeCount}
              </Button>
              <Button
                onClick={() => {
                  router.push(`/posts/${post._id}`);
                }}
                startIcon={<ChatIcon />}
                variant={'contained'}
                // color='primary'
              >
                {post.comments.length}
              </Button>
            </Box>
          </Box>
        </Box>
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
