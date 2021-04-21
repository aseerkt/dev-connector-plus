import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import PeopleIcon from '@material-ui/icons/People';
import { formatAvatarUrl } from '../../utils/formatAvatarUrl';
import { useGetAllProfilesQuery } from '../../generated/graphql';
import Layout from '../../components/Layout';
import { withApollo } from '../../utils/withApollo';
import PageLoader from '../../components/PageLoader';

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  avatarImage: {
    position: 'relative',
    width: '9rem',
    height: '9rem',
    borderRadius: '50%',
    overflow: 'hidden',
  },
  profileContentWrapper: {
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '1fr',
      paddingLeft: 0,
    },
  },
  authorName: {
    fontWeight: 700,
    color: '#222d36',
  },
  authorStatus: {
    fontSize: '1rem',
  },
  authorLocation: {
    fontSize: '0.98rem',
  },
  skillContainer: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
      // alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: '1rem',
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'space-between',
    },
  },
  skill: {
    display: 'flex',
    alignItems: 'center',
    color: '#7373e2',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '0.4rem',
    },
  },
  skillText: {
    marginLeft: '0.7rem',
  },
}));

const Profiles = () => {
  const classes = useStyles();
  const router = useRouter();
  const { data, loading } = useGetAllProfilesQuery();

  if (loading) {
    return <PageLoader />;
  } else if (!data || (data && !data.getAllProfiles)) {
    return (
      <Layout headTitle='No profiles found'>
        <h3>No profiles found</h3>
      </Layout>
    );
  }

  const profiles = data.getAllProfiles;

  return (
    <Layout
      headTitle='Developers Profiles'
      title='Developers'
      subTitle='Browse and connect with developers'
      includeNavbar
      Icon={PeopleIcon}
    >
      {profiles.map((profile) => (
        <Box
          key={profile._id}
          className={classes.avatarContainer}
          display='flex'
          width='100%'
          border='1px solid #979494'
          borderRadius='2rem'
          padding='2rem'
          marginBottom='3rem'
        >
          <div className={classes.avatarImage}>
            <Image
              src={formatAvatarUrl(profile.user.avatar)}
              layout='fill'
              objectFit='cover'
            />
          </div>
          <Box
            className={classes.profileContentWrapper}
            flex={1}
            display='grid'
            width='100%'
            gridTemplateColumns='60% 40%'
            justifyContent='space-between'
            alignItems='center'
            paddingLeft='2.5rem'
          >
            <Box>
              <Typography className={classes.authorName} variant='h5' paragraph>
                {profile.user.name}
              </Typography>
              <p className={classes.authorStatus}>
                {profile.status} at {profile.company}
              </p>
              <p className={classes.authorLocation}>{profile.location}</p>
              <Button
                onClick={() => {
                  router.push(`/profiles/${profile.user._id}`);
                }}
                variant='contained'
                color='primary'
              >
                View Profile
              </Button>
            </Box>
            <Box
              className={classes.skillContainer}
              display='flex'
              flexDirection='column'
            >
              {profile.skills.split(',').map((s) => (
                <p key={s.trim() + profile._id} className={classes.skill}>
                  <CheckCircleIcon />{' '}
                  <span className={classes.skillText}>{s.trim()}</span>
                </p>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Profiles);
