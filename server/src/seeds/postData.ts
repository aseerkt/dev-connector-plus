import { Post } from '../entities/Post';

const postData = [
  {
    title: 'React Context API',
    body: 'Context provides a way to pass data through the component tree without having to pass props down manually at every level. In a typical React application, data is passed top-down (parent to child) via props, but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.',
  } as Post,
  {
    title: 'Next.js',
    body: 'Next.js is an open-source React front-end development web framework created by Vercel that enables functionality such as server-side rendering and generating static websites for React based web applications.',
  } as Post,
  {
    title: 'GraphQL',
    body: 'GraphQL is an open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data. GraphQL was developed internally by Facebook in 2012 before being publicly released in 2015.',
  } as Post,
];

export default postData;
