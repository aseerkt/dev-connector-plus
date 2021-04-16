export const PORT = process.env.PORT || 5000;
export const COOKIE_NAME = 'gitToken';
export const __prod__ = process.env.NODE_ENV === 'production';
export const GRAVATAR_PREFIX = '//www.gravatar.com/avatar/';
export const FRONTEND_DOMAIN = String(process.env.FRONTEND_URL!)
  .replace(__prod__ ? 'https://' : 'http://', '')
  .split(':')[0];
