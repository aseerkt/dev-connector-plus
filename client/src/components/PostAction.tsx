import { gql } from '@apollo/client';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import React, { useState } from 'react';
import {
  Post,
  useDeletePostMutation,
  useMeQuery,
  useToggleLikeMutation,
} from '../generated/graphql';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import ChatIcon from '@material-ui/icons/Chat';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { useRouter } from 'next/router';

interface PostActionProps {
  post: Post;
}
const useStyles = makeStyles({
  likeButton: {},
  dislikeButton: {
    marginLeft: '0.5rem',
  },
  commentButton: {
    marginLeft: '0.5rem',
    backgroundColor: '#90af5d',
    color: '#fff',
  },
  deletePostButton: {
    marginLeft: '0.5rem',
  },
  popMenuItem: {
    padding: '0.2rem 0.6rem',
  },
  popListText: {
    marginLeft: 0,
    paddingLeft: 0,
  },
});

const PostAction: React.FC<PostActionProps> = ({ post }) => {
  const router = useRouter();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const { data: meData } = useMeQuery();
  const [toggleLike, { loading }] = useToggleLikeMutation();
  const [deletePost] = useDeletePostMutation();

  if (meData && !meData.me) {
    return null;
  }

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
    <>
      <Button
        className={classes.likeButton}
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
        className={classes.dislikeButton}
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
        className={classes.commentButton}
        onClick={() => {
          router.push(`/posts/${post._id}`);
        }}
        startIcon={<ChatIcon />}
        variant={'contained'}
        // color='primary'
      >
        {post.comments.length}
      </Button>
      {meData && meData.me && meData.me._id == post.user._id && (
        <>
          <IconButton
            aria-controls='post-menu'
            aria-haspopup='true'
            className={classes.deletePostButton}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
            }}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id='long-menu'
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => {
              setAnchorEl(null);
            }}
          >
            <MenuItem
              onClick={() => {
                router.push(`/edit-post/${post._id}`);
              }}
              className={classes.popMenuItem}
            >
              <ListItemIcon>
                <EditIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText
                className={classes.popListText}
                primary='Edit Post'
              />
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await deletePost({
                  variables: { postId: post._id },
                  update: (cache, { data }) => {
                    if (data.deletePost) {
                      cache.evict({
                        id: 'Post:' + post._id,
                      });
                      setAnchorEl(null);
                    }
                  },
                });
              }}
              className={classes.popMenuItem}
            >
              <ListItemIcon>
                <DeleteForeverIcon fontSize='small' />
              </ListItemIcon>
              <ListItemText
                className={classes.popListText}
                primary='Delete Post'
              />
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};

export default PostAction;
