import { Box, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import GitHubIcon from '@material-ui/icons/GitHub';

const fetchRepos = async (username: string) => {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=created&per_page=5`
  ).then((res) => res.json());
  return res;
};

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  avatar_url: string;
  forks: number;
  watchers: number;
  stargazers_count: number;
}

const useStyles = makeStyles((theme) => ({
  repoContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      '&:first-child': {
        justifySelf: 'flex-start',
      },
    },
  },
  gitHubCountWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      '& > *': {
        height: 'auto',
        margin: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
      },
    },
  },
}));

const GitHubRepos: React.FC<{ githubusername: string }> = ({
  githubusername,
}) => {
  const classes = useStyles();
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  // Fetch Github repos
  useEffect(() => {
    if (githubusername) {
      fetchRepos(githubusername).then((responses) => {
        setRepos(
          responses.map((res) => ({
            id: res.id,
            name: res.name,
            description: res.description,
            html_url: res.html_url,
            avatar_url: res.owner.avatar_url,
            forks: res.forks,
            watchers: res.watchers,
            stargazers_count: res.stargazers_count,
          }))
        );
      });
    }
  }, [githubusername]);

  if (!githubusername) {
    return (
      <Box padding='2rem' textAlign='center'>
        <p>Please provide your github username to see latest repos</p>
      </Box>
    );
  }
  if (repos.length > 0) {
    return (
      <Box marginBottom='2rem' width='100%'>
        <h1>
          <GitHubIcon /> GitHub Repositories
        </h1>
        {repos.map((repo) => (
          <Box
            className={classes.repoContainer}
            padding='2rem'
            key={repo.id}
            width='100%'
            marginBottom='1rem'
            border='1px solid gray'
            borderRadius='0.8rem'
            bgcolor='#f4f4f4'
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box alignContent='flex-start' flex='1'>
              <a href={repo.html_url} target='_blank'>
                <h2>
                  {githubusername}/{repo.name}
                </h2>
              </a>
              <p>{repo.description}</p>
            </Box>
            <Box className={classes.gitHubCountWrapper} height='100%'>
              <Box
                width={120}
                bgcolor='#c9f3d0'
                border='1px sold lightgray'
                borderRadius='1px'
                padding='0.2rem 0.6rem'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <span>Stars</span> <span>{repo.stargazers_count}</span>
              </Box>
              <Box
                width={120}
                bgcolor='#c9f3d0'
                border='1px sold lightgray'
                borderRadius='1px'
                padding='0.2rem 0.6rem'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                marginTop='0.5rem'
                marginBottom='0.5rem'
              >
                <span>Watchers</span> <span>{repo.watchers}</span>
              </Box>
              <Box
                width={120}
                bgcolor='#c9f3d0'
                border='1px sold lightgray'
                borderRadius='1px'
                padding='0.2rem 0.6rem'
                display='flex'
                alignItems='center'
                justifyContent='space-between'
              >
                <span>Forks</span> <span>{repo.forks}</span>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  }
  return <div></div>;
};

export default GitHubRepos;
