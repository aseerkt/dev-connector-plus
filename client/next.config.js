require('dotenv').config({ path: '.env.local' });

module.exports = {
  images: {
    domains: ['www.gravatar.com', String(process.env.APP_DOMAIN)],
  },
};
