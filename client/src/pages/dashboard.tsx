import { Container, Button, Link, CircularProgress } from '@material-ui/core';
import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import AssignmentIcon from '@material-ui/icons/Assignment';
import SchoolIcon from '@material-ui/icons/School';
import { useRouter } from 'next/router';
import {
  Education,
  Experience,
  useDeleteEduMutation,
  useDeleteExpMutation,
  useDeleteUserMutation,
  useMyProfileQuery,
  User,
} from '../generated/graphql';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import PersonIcon from '@material-ui/icons/Person';
import Navbar from '../components/Navbar';
import { Alert, AlertTitle } from '@material-ui/lab';
import NextLink from 'next/link';
import dayjs from 'dayjs';
import { GetServerSideProps, NextPage } from 'next';
import { getUserFromServer } from '../utils/getUserFromServer';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import Head from 'next/head';
import { initializeApollo } from '../utils/withApollo';
import Layout from '../components/Layout';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#f4f4f4',
    fontWeight: 'bold',
  },
  body: {
    fontSize: 14,
    backgroundColor: theme.palette.common.white,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  buttonRight: {
    marginRight: theme.spacing(1),
  },
  my2: {
    marginTop: '2rem',
    marginBottom: '2rem',
  },
}));

const Dashboard: NextPage<{ user: User }> = ({ user }) => {
  const router = useRouter();
  const classes = useStyles();
  const apolloClient = initializeApollo();
  const { data: profileData, loading } = useMyProfileQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [deleteExp] = useDeleteExpMutation();
  const [deleteEdu] = useDeleteEduMutation();

  const deleteAction = async (type: 'acc' | 'exp' | 'edu', id?: string) => {
    switch (type) {
      case 'acc':
        await deleteUser({
          update(_, { data }) {
            if (data.deleteUser) {
              apolloClient.resetStore();
              router.push('/');
            }
          },
        });
        break;
      case 'exp':
        await deleteExp({
          variables: { expId: id },
          update(cache, { data }) {
            if (data.deleteExp) cache.evict({ id: 'Experience:' + id });
          },
        });
        break;
      case 'edu':
        await deleteEdu({
          variables: { eduId: id },
          update(cache, { data }) {
            if (data.deleteEdu) cache.evict({ id: 'Education:' + id });
          },
        });
        break;
    }
  };

  let experiences: Experience[] | null = null;
  let educations: Education[] | null = null;
  let profileBody: JSX.Element | JSX.Element[] = null;

  if (loading) {
    profileBody = <CircularProgress />;
  }
  if (profileData && profileData.myProfile) {
    experiences = profileData.myProfile.experiences;
    educations = profileData.myProfile.educations;
    profileBody = (
      <>
        <div>
          <Button
            variant='contained'
            className={classes.buttonRight}
            onClick={() => {
              router.push('/edit-profile');
            }}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
          <Button
            variant='contained'
            className={classes.buttonRight}
            onClick={() => {
              router.push('/add-experience');
            }}
            startIcon={<AssignmentIcon />}
          >
            Add Experience
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              router.push('/add-education');
            }}
            startIcon={<SchoolIcon />}
          >
            Add Education
          </Button>
        </div>
        {/* EXPERIENCE CREDENTIALS */}
        <h2 className={classes.my2}>Experience Credentials</h2>
        {experiences && experiences.length > 0 ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Company</StyledTableCell>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell>Years</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {experiences.map((exp) => (
                  <StyledTableRow key={exp._id}>
                    <StyledTableCell component='th' scope='row'>
                      {exp.company}
                    </StyledTableCell>
                    <StyledTableCell>{exp.title}</StyledTableCell>
                    <StyledTableCell>
                      {dayjs(exp.from).format('DD-MMM-YYYY')} -{' '}
                      {exp.to
                        ? dayjs(exp.to).format('DD-MMM-YYYY')
                        : exp.current
                        ? 'Now'
                        : '__'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        onClick={() => deleteAction('exp', exp._id)}
                        variant='contained'
                        color='secondary'
                        startIcon={<DeleteForeverIcon />}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert variant='outlined' severity='info'>
            <AlertTitle>Experience credentials are empty</AlertTitle>
            You have not added any experience yet —{' '}
            <NextLink href='/add-experience'>
              <Link href='#'>Add Experience</Link>
            </NextLink>
          </Alert>
        )}

        {/* EDUCATION CREDENTIALS */}
        <h2 className={classes.my2}>Education Credentials</h2>
        {educations && educations.length > 0 ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>School</StyledTableCell>
                  <StyledTableCell>Degree</StyledTableCell>
                  <StyledTableCell>Years</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {educations.map((edu) => (
                  <StyledTableRow key={edu._id}>
                    <StyledTableCell component='th' scope='row'>
                      {edu.school}
                    </StyledTableCell>
                    <StyledTableCell>{edu.degree}</StyledTableCell>
                    <StyledTableCell>
                      {dayjs(edu.from).format('DD-MMM-YYYY')} -{' '}
                      {edu.to
                        ? dayjs(edu.to).format('DD-MMM-YYYY')
                        : edu.current
                        ? 'Now'
                        : '__'}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        onClick={() => deleteAction('edu', edu._id)}
                        variant='contained'
                        color='secondary'
                        startIcon={<DeleteForeverIcon />}
                      >
                        Delete
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert variant='outlined' severity='info'>
            <AlertTitle>Education credentials are empty</AlertTitle>
            You have not added any educations yet —{' '}
            <NextLink href='/add-education'>
              <Link href='#'>Add Education</Link>
            </NextLink>
          </Alert>
        )}
      </>
    );
  } else if (!loading && profileData && !profileData.myProfile) {
    profileBody = (
      <>
        <p>You have not setup a profile, please add some info</p>
        <Button
          startIcon={<PermContactCalendarIcon />}
          variant='contained'
          color='primary'
          onClick={() => {
            router.push('/create-profile');
          }}
        >
          Create Profile
        </Button>
      </>
    );
  }
  return (
    <Layout
      headTitle={`${user.name} | Dashboard`}
      title='Dashboard'
      subTitle={`Welcome ${user.name}`}
      includeNavbar
    >
      {profileBody}
      {/* DELETE ACCOUNT BUTTON */}
      <div className={classes.my2}>
        <Button
          startIcon={<IndeterminateCheckBoxIcon />}
          color='secondary'
          variant='contained'
          onClick={() => deleteAction('acc')}
        >
          Delete My Account
        </Button>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUserFromServer(req);
  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return { props: { user } };
};

export default Dashboard;
