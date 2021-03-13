import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Image from 'next/image';
import { addApolloState, initializeApollo } from '../../utils/withApollo';
import {
  GetAllProfilesDocument,
  GetAllProfilesQuery,
  Profile,
} from '../../generated/graphql';
import Layout from '../../components/Layout';
import PeopleIcon from '@material-ui/icons/People';
import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { formatAvatarUrl } from '../../utils/formatAvatarUrl';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { useRouter } from 'next/router';

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
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
      flexDirection: 'column',
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
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: '1rem',
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

const Profiles: NextPage<{ profiles: Profile[] }> = ({ profiles }) => {
  const classes = useStyles();
  const router = useRouter();
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
            display='flex'
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
                <p className={classes.skill}>
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const apolloClient = initializeApollo();
  const fetchProfiles = await apolloClient.query<GetAllProfilesQuery>({
    query: GetAllProfilesDocument,
  });
  const profiles = fetchProfiles.data.getAllProfiles;
  return addApolloState(apolloClient, { props: { profiles } });
};

export default Profiles;
