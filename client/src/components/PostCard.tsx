import { Box, Typography, makeStyles } from '@material-ui/core';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';
import { Post } from '../generated/graphql';
import { formatAvatarUrl } from '../utils/formatAvatarUrl';
import PostAction from './PostAction';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type PostCardProps = {
  post: Post;
  useMinimumText?: boolean;
};

const useStyles = makeStyles((theme) => ({
  postCard: {
    display: 'flex',
    width: '100%',
    border: '1px solid #979494',
    borderRadius: '2rem',
    padding: '2rem',
    marginBottom: '3rem',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '1.5rem',
    },
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatarImage: {
    cursor: 'pointer',
    position: 'relative',
    height: '10rem',
    width: '10rem',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  authorName: {
    cursor: 'pointer',
    textAlign: 'center',
    color: '#88a0f0',
    fontWeight: 700,
    fontSize: '1.1rem',
  },
  contentBox: {
    paddingLeft: '2.5rem',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },
  postTitle: {
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
  },
  postBody: {
    display: 'flex',
    flexDirection: 'column',
    wordBreak: 'break-all',
    // whiteSpace: 'normal',
    '&> pre': {
      padding: '0.4rem',
      borderRadius: '0.2rem',
      backgroundColor: '#e4e0e0',
      width: '100%',
      overflowX: 'auto',
    },
  },
  postBodyDiv: {
    height: '7rem',
    overflow: 'hidden',
    marginBottom: '0.7rem',
    '-mozBoxShadow': 'inset 0 -10px 10px -10px #fff',
    '-webkitBoxShadow': 'inset 0 -10px 10px -10px #fff',
    boxShadow: 'inset 0 -10px 10px -10px #fff',
  },
  postTime: {
    fontWeight: 300,
    cursor: 'pointer',
    display: 'block',
    marginBottom: '1em',
  },
}));

const PostCard: React.FC<PostCardProps> = ({
  post,
  useMinimumText = false,
}) => {
  const router = useRouter();
  const classes = useStyles();

  return (
    <Box className={classes.postCard}>
      <Box className={classes.avatarContainer}>
        <div
          onClick={(e) => {
            router.push(`/profiles/${post.user._id}`);
          }}
          className={classes.avatarImage}
        >
          <Image
            src={formatAvatarUrl(post.user.avatar)}
            layout='fill'
            objectFit='cover'
          />
        </div>
        <p
          onClick={(e) => {
            router.push(`/profiles/${post.user._id}`);
          }}
          className={classes.authorName}
        >
          {post.user.name}
        </p>
      </Box>
      <Box
        flex={1}
        display='flex'
        justifyContent='space-between'
        flexDirection='column'
        className={classes.contentBox}
      >
        <h2
          className={classes.postTitle}
          onClick={() => {
            router.push(`/posts/${post._id}`);
          }}
        >
          {post.title}
        </h2>
        <div
          className={`${classes.postBody} ${
            useMinimumText ? classes.postBodyDiv : ''
          }`}
          dangerouslySetInnerHTML={{
            __html: post.body,
          }}
        ></div>
        <small
          onClick={() => {
            router.push(`/posts/${post._id}`);
          }}
          className={classes.postTime}
        >
          Posted on {dayjs(post.createdAt).fromNow()}
        </small>
        <div>
          <PostAction post={post} />
        </div>
      </Box>
    </Box>
  );
};

export default PostCard;
