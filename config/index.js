const dotenv = require('dotenv');
dotenv.config();

let config = {
  port:process.env.PORT || '8080',
  cors:process.env.CORS || '*',
  node_env:process.env.NODE_ENV !=='production',
  email_support: process.env.EMAIL_SUPPORT
}

module.exports = { config }  