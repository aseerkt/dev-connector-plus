import { Comment } from '../generated/graphql';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import classes from '*.module.css';
import React from 'react';
import { formatAvatarUrl } from '../utils/formatAvatarUrl';
import Image from 'next/image';
import { Box, makeStyles } from '@material-ui/core';
import { useRouter } from 'next/router';

dayjs.extend(relativeTime);

const useStyles = makeStyles({
  avatarImage: {
    cursor: 'pointer',
    position: 'relative',
    height: '5rem',
    width: '5rem',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  authorName: {
    cursor: 'pointer',
    textAlign: 'center',
    color: '#88a0f0',
    fontWeight: 500,
    fontSize: '0.8rem',
    marginBottom: 0,
  },
  commentTime: {
    fontWeight: 300,
    cursor: 'pointer',
    display: 'block',
    marginBottom: '1em',
  },
});

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
  const classes = useStyles();
  const router = useRouter();
  return (
    <Box
      display='flex'
      width='100%'
      border='1px solid #979494'
      borderRadius='1rem'
      padding='1.7rem'
      marginBottom='3rem'
    >
      <Box>
        <div
          onClick={(e) => {
            router.push(`/profiles/${comment.user._id}`);
          }}
          className={classes.avatarImage}
        >
          <Image
            src={formatAvatarUrl(comment.user.avatar)}
            layout='fill'
            objectFit='cover'
          />
        </div>
        <p
          onClick={(e) => {
            router.push(`/profiles/${comment.user._id}`);
          }}
          className={classes.authorName}
        >
          {comment.user.name}
        </p>
      </Box>
      <Box
        flex={1}
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        paddingLeft='2.5rem'
      >
        <Box>
          <p>{comment.text}</p>
          <small className={classes.commentTime}>
            Commented on {dayjs(comment.createdAt).fromNow()}
          </small>
          {/* <PostAction post={post} /> */}
        </Box>
      </Box>
    </Box>
  );
};

export default CommentCard;
