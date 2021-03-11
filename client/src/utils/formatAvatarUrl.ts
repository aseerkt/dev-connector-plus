export const formatAvatarUrl = (url: string) => {
  if (url.startsWith('//')) return 'https:' + url;
  else return url;
};
