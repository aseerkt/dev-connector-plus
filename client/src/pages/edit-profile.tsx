import {
  Accordion,
  AccordionSummary,
  Button,
  AccordionDetails,
  Box,
  makeStyles,
} from '@material-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import FormWrapper from '../components/FormWrapper';
import InputField from '../components/InputField';
import {
  MyProfileQuery,
  MyProfileDocument,
  useUpdateProfileMutation,
  useMyProfileQuery,
} from '../generated/graphql';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import YouTubeIcon from '@material-ui/icons/YouTube';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from '@material-ui/icons/Instagram';
import { useRouter } from 'next/router';
import { withApollo } from '../utils/withApollo';
import PageLoader from '../components/PageLoader';
import Layout from '../components/Layout';

const statusValues = [
  // { value: '0', label: '* -- Select Professional Status' },
  { value: 'Developer', label: 'Developer' },
  { value: 'Junior Developer', label: 'Junior Developer' },
  {
    value: 'Senior Developer',
    label: 'Senior Developer',
  },
  { value: 'Manager', label: 'Manager' },
  { value: 'Student or Learning', label: 'Student or Learning' },
  { value: 'Instructor', label: 'Instructor or Teacher' },
  { value: 'Intern', label: 'Intern' },
  { value: 'Other', label: 'Other' },
];

const useStyles = makeStyles({
  socialInput: {
    marginLeft: '1rem',
  },
});

const EditProfile = () => {
  const router = useRouter();
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [updateProfile] = useUpdateProfileMutation();

  const { data, loading } = useMyProfileQuery();
  if (loading) {
    return <PageLoader />;
  } else if (!data || (data && !data.myProfile)) {
    return (
      <Layout headTitle='Profile Not Found'>
        <h3>Could not find any profile</h3>
        <Button
          onClick={() => {
            router.push('/create-profile');
          }}
        >
          Create Profile
        </Button>
      </Layout>
    );
  }

  const profile = data.myProfile;

  return (
    <FormWrapper
      includeNavbar
      w='md'
      title='Edit Profile'
      formTitle='Keep yourserlf one step ahead by updating the profile'
    >
      <Formik
        initialValues={{
          company: profile.company ? profile.company : '',
          website: profile.website ? profile.website : '',
          location: profile.location ? profile.location : '',
          status: profile.status ? profile.status : '',
          bio: profile.bio ? profile.bio : '',
          githubusername: profile.githubusername ? profile.githubusername : '',
          skills: profile.skills ? profile.skills : '',
          social: {
            youtube: profile.social.youtube ? profile.social.youtube : '',
            twitter: profile.social.twitter ? profile.social.twitter : '',
            facebook: profile.social.facebook ? profile.social.facebook : '',
            linkedin: profile.social.linkedin ? profile.social.linkedin : '',
            instagram: profile.social.instagram ? profile.social.instagram : '',
          },
        }}
        onSubmit={async (values, action) => {
          console.log(values);
          try {
            const res = await updateProfile({
              variables: { profileInput: values },
              update: (cache, { data }) => {
                const { profile } = data.updateProfile;
                if (profile) {
                  cache.writeQuery<MyProfileQuery>({
                    query: MyProfileDocument,
                    data: { myProfile: profile },
                  });
                  router.push('/dashboard');
                }
              },
            });
            console.log(res);
            const { errors } = res.data.updateProfile;
            if (errors) {
              errors.forEach(({ path, message }) => {
                action.setFieldError(path, message);
              });
            }
          } catch (err) {
            console.error(err);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name='status'
              label='Status*'
              select={{ defaultValue: '0', options: statusValues }}
              helperText='Give us an idea of where you are at in your career'
            />
            <InputField
              name='company'
              label='Company'
              helperText='Could be your own company or one you work for'
            />
            <InputField
              name='website'
              label='Website'
              helperText='Could be your own or a company website'
            />
            <InputField
              name='location'
              label='Location'
              helperText='City & state suggested (eg. Mumbai, India)'
            />
            <InputField
              name='skills'
              label='Skills*'
              helperText='Please use comma separated values (eg.
              HTML,CSS,JavaScript,PHP)'
            />
            <InputField
              name='githubusername'
              label='GitHub Username'
              helperText='If you want your latest repos and a Github link, include your
            username'
            />
            <InputField
              multiple
              name='bio'
              label='Bio'
              helperText='Tell us a little about yourself'
            />
            <Accordion
              expanded={expanded}
              onChange={() => setExpanded(!expanded)}
              style={{ marginBottom: '2rem' }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1bh-content'
                id='panel1bh-header'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Button variant='contained'>Add Social Network Links</Button>
                <p style={{ marginLeft: '1rem' }}>(Optional)</p>
              </AccordionSummary>
              <AccordionDetails>
                <Box display='flex' flexDirection='column' width='100%'>
                  <Box
                    width='100%'
                    display='flex'
                    alignItems='center'
                    marginBottom='1.5rem'
                  >
                    <YouTubeIcon color='secondary' fontSize='large' />
                    <InputField
                      className={classes.socialInput}
                      MuiSize='small'
                      name='social.youtube'
                      label='YouTube'
                    />
                  </Box>
                  <Box
                    width='100%'
                    display='flex'
                    alignItems='center'
                    marginBottom='1.5rem'
                  >
                    <FacebookIcon
                      style={{ color: '#2925f0' }}
                      fontSize='large'
                    />
                    <InputField
                      className={classes.socialInput}
                      MuiSize='small'
                      name='social.facebook'
                      label='Facebook'
                    />
                  </Box>
                  <Box
                    width='100%'
                    display='flex'
                    alignItems='center'
                    marginBottom='1.5rem'
                  >
                    <TwitterIcon
                      style={{ color: '#7371f3' }}
                      fontSize='large'
                    />
                    <InputField
                      className={classes.socialInput}
                      MuiSize='small'
                      name='social.twitter'
                      label='Twitter'
                    />
                  </Box>
                  <Box
                    width='100%'
                    display='flex'
                    alignItems='center'
                    marginBottom='1.5rem'
                  >
                    <LinkedInIcon
                      style={{ color: '#5857af' }}
                      fontSize='large'
                    />
                    <InputField
                      className={classes.socialInput}
                      MuiSize='small'
                      name='social.linkedin'
                      label='Linkedin'
                    />
                  </Box>
                  <Box
                    width='100%'
                    display='flex'
                    alignItems='center'
                    marginBottom='1.5rem'
                  >
                    <InstagramIcon
                      style={{ color: '#c4330e' }}
                      fontSize='large'
                    />
                    <InputField
                      className={classes.socialInput}
                      MuiSize='small'
                      name='social.instagram'
                      label='Instagram'
                    />
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Button
              disabled={isSubmitting}
              type='submit'
              variant='contained'
              color='primary'
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </FormWrapper>
  );
};

export default withApollo({ ssr: false })(EditProfile);
