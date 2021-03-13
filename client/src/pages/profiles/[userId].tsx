import React, { createRef } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Fab,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { addApolloState, initializeApollo } from '../../utils/withApollo';
import {
  GetProfileDocument,
  GetProfileQuery,
  useGetProfileQuery,
  useMeQuery,
  useUpdateAvatarMutation,
} from '../../generated/graphql';
import Layout from '../../components/Layout';
import Image from 'next/image';
import { formatAvatarUrl } from '../../utils/formatAvatarUrl';
import YouTubeIcon from '@material-ui/icons/YouTube';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import LanguageIcon from '@material-ui/icons/Language';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import dayjs from 'dayjs';
import GitHubRepos from '../../components/GitHubRepos';
import { gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  topBox: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    marginTop: '1rem',
    marginBottom: '2rem',
    borderRadius: '2rem',
  },
  avatarContainer: {
    position: 'relative',
    width: '13rem',
    height: '13rem',
    borderRadius: '50%',
    overflow: 'hidden',
    // boxShadow: '0 0 7px 5px rgba(0,0,0,0.5)',
  },
  uploadButton: {
    position: 'absolute',
    zIndex: 2,
    right: '8px',
    bottom: '8px',
  },

  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },

  nameText: {
    fontSize: '2.6rem',
    fontWeight: 700,
    marginBottom: '0.7rem',
  },
  statusText: {
    fontSize: '1.6rem',
    marginTop: 0,
    marginBottom: 0,
    textAlign: 'center',
  },
  locationText: {
    fontSize: '1.1rem',
    fontWeight: 400,
  },
  socialIconLink: {
    paddingLeft: '0.4rem',
    paddingRight: '0.4rem',
    fontSize: '2rem',
  },
  socialIcons: {
    fontSize: '2.8rem',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.5)',
    },
  },
  gridItem: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
}));

const icons = {
  youtube: YouTubeIcon,
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
};

const ProfilePage: NextPage<{ userId: string }> = ({ userId }) => {
  const router = useRouter();
  const classes = useStyles();
  const { data: meData } = useMeQuery();
  const {
    data: { getProfileByUserId: profile },
  } = useGetProfileQuery({ variables: { userId } });

  const [updateAvatar, { loading: uploading }] = useUpdateAvatarMutation();

  const inputRef = createRef<HTMLInputElement>();

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      await updateAvatar({
        variables: { file },
        update: (cache, { data }) => {
          const newAvatarURL = data.updateAvatar;
          if (!newAvatarURL) return;
          const fragment = gql`
            fragment Avatar on User {
              avatar
            }
          `;
          cache.writeFragment({
            fragment,
            id: 'User:' + profile.user._id,
            data: { avatar: newAvatarURL },
          });
        },
      });
    }
  };

  const {
    user,
    status,
    company,
    website,
    experiences,
    educations,
    location,
    social,
    bio,
    skills,
    githubusername,
  } = profile;

  const socialMarkup: JSX.Element | JSX.Element[] = [
    <span key='asdfsadfsdsdf'></span>,
  ];

  Object.entries(social).forEach(([socialName, url]) => {
    if (url) {
      const Icon = icons[socialName];
      if (Icon) {
        socialMarkup.push(
          <a
            className={classes.socialIconLink}
            target='_blank'
            key={url}
            href={url}
          >
            <Icon className={classes.socialIcons} fontSize='large' />
          </a>
        );
      }
    }
  });

  // console.log(socialMarkup);

  return (
    <Layout includeNavbar headTitle={`${profile.user.name} | Profile`}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => {
          router.push('/profiles');
        }}
        variant='contained'
      >
        Back To Profiles
      </Button>
      {/* Top Box */}
      <Box
        textAlign='center'
        className={classes.topBox}
        display='flex'
        flexDirection='column'
        alignItems='center'
        width='100%'
        padding='3rem'
      >
        <Box position='relative'>
          <div className={classes.avatarContainer}>
            <Image
              src={formatAvatarUrl(user.avatar)}
              layout='fill'
              objectFit='cover'
            />
          </div>
          {meData && meData.me && meData.me._id == profile.user._id && (
            <>
              <Fab
                onClick={() => {
                  inputRef.current?.click();
                }}
                className={classes.uploadButton}
              >
                <CameraAltIcon />
              </Fab>
              <input type='file' ref={inputRef} onChange={uploadPhoto} hidden />
              <Backdrop
                className={classes.backdrop}
                open={uploading}
                // onClick={handleClose}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
            </>
          )}
        </Box>

        <h1 className={classes.nameText}>{user.name}</h1>
        <p className={classes.statusText}>
          {status} at {company}
        </p>
        <p className={classes.locationText}>{location}</p>
        <Box display='flex'>
          {website && (
            <a
              className={classes.socialIconLink}
              href={website}
              target='_blank'
            >
              <LanguageIcon className={classes.socialIcons} fontSize='large' />
            </a>
          )}
          {socialMarkup}
        </Box>
      </Box>
      {/* MiddleBox */}
      <Box
        padding='2rem'
        border='1px solid gray'
        borderRadius='2rem'
        marginBottom='2rem'
        bgcolor='#f4f4f4'
      >
        <Box
          textAlign='center'
          paddingBottom='0.4rem'
          borderBottom='1px solid lightgray'
        >
          <h1>{user.name.split(' ')[0]}'s Bio</h1>
          <p>{bio ? bio : 'No bio added yet'}</p>
        </Box>
        <Box textAlign='center'>
          <h1>Skill Set</h1>

          <Box
            color='#1e8aee'
            display='flex'
            flexWrap='wrap'
            justifyContent='center'
          >
            {skills.split(',').map((s) => (
              <Box
                key={s}
                display='flex'
                alignItems='center'
                paddingLeft='1.2rem'
                paddingRight='1.2rem'
                marginTop='1rem'
              >
                <CheckCircleIcon style={{ marginRight: '.5rem' }} />{' '}
                <span>{s.trim()}</span>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
      {/* Edu Exp Boxes */}
      <Grid container spacing={3}>
        <Grid className={classes.gridItem} item sm={12} md={6}>
          <Box
            height='100%'
            padding='1.4rem'
            border='1px solid gray'
            borderRadius='1rem'
          >
            <h1>Experience</h1>
            {experiences.map((exp, i) => (
              <Box
                key={exp._id}
                borderBottom={
                  i == experiences.length - 1 ? '' : '1px solid lightgray'
                }
              >
                <p>{exp.company}</p>
                <p>
                  {dayjs(exp.from).format('MMM-YYYY')} -{' '}
                  {exp.to
                    ? dayjs(exp.to).format('MMM-YYYY')
                    : exp.current
                    ? 'Now'
                    : '__'}
                </p>
                <p>
                  <strong>Position: </strong>
                  {exp.title}
                </p>
                <p>
                  <strong>Description: </strong>
                  {exp.description ? exp.description : 'No description given'}
                </p>
              </Box>
            ))}
          </Box>
        </Grid>
        <Grid className={classes.gridItem} item sm={12} md={6}>
          <Box
            height='100%'
            padding='1.4rem'
            border='1px solid gray'
            borderRadius='1rem'
          >
            <h1>Education</h1>
            {educations.map((edu, i) => (
              <Box
                key={edu._id}
                borderBottom={
                  i == educations.length - 1 ? '' : '1px solid lightgray'
                }
              >
                <p>{edu.school}</p>
                <p>
                  {dayjs(edu.from).format('MMM-YYYY')} -{' '}
                  {edu.to
                    ? dayjs(edu.to).format('MMM-YYYY')
                    : edu.current
                    ? 'Now'
                    : '__'}
                </p>
                <p>
                  <strong>Degree: </strong>
                  {edu.degree}
                </p>
                <p>
                  <strong>Field Of Study: </strong>
                  {edu.fieldofstudy}
                </p>
                <p>
                  <strong>Description: </strong>
                  {edu.description ? edu.description : 'No description given'}
                </p>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <GitHubRepos githubusername={githubusername} />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { userId } = query;
  const apolloClient = initializeApollo();

  const profileRes = await apolloClient.query<GetProfileQuery>({
    query: GetProfileDocument,
    variables: { userId },
  });
  const profile = profileRes.data.getProfileByUserId;
  if (!profile) return { redirect: { destination: '/profiles' } };
  return addApolloState(apolloClient, { props: { userId } });
};

export default ProfilePage;
