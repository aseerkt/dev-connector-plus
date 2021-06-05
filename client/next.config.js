require('dotenv').config({ path: '.env.local' });

module.exports = {
  images: {
    domains: [
      'www.gravatar.com',
      'avatars.githubusercontent.com',
      String(process.env.APP_DOMAIN),
    ],
  },
};
