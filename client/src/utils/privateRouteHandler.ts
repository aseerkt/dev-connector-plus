const privateRoutes = [
  '/dashboard',
  '/edit-post',
  '/create-profile',
  '/edit-profile',
  '/add-post',
  '/add-experience',
  '/add-education',
];

export const checkIsPrivate = (route: string) =>
  privateRoutes.some((path) => route.includes(path));
