import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import { Button, makeStyles } from '@material-ui/core';
import PostAddIcon from '@material-ui/icons/PostAdd';
import { useRouter } from 'next/router';
import { withApollo } from '../../utils/withApollo';
import { useGetPostsQuery, Post } from '../../generated/graphql';
import Layout from '../../components/Layout';
import PostCard from '../../components/PostCard';
import PageLoader from '../../components/PageLoader';

const useStyles = makeStyles((theme) => ({
  addPostButton: {
    marginBottom: '2rem',
  },
}));

const Posts = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading } = useGetPostsQuery();

  if (loading) {
    return <PageLoader />;
  } else if (!data || (data && !data.getPosts)) {
    return (
      <Layout headTitle='Posts not found'>
        <h3>Posts not found</h3>
      </Layout>
    );
  }

  const posts = data.getPosts;

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
        <PostCard key={post._id} useMinimumText post={post as Post} />
      ))}
    </Layout>
  );
};

export default withApollo({ ssr: false })(Posts);
