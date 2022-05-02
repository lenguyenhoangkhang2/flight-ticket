export default {
  port: 3000,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  logLevel: 'info',
  smtp: {
    user: 'uonij4yknst4qhck@ethereal.email',
    pass: 'S53sHR1yQySxBBAgTH',
    port: 587,
    host: 'smtp.ethereal.email',
    secure: false,
  },
  initialAdmin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    identityCardNumber: process.env.ADMIN_IDENTITY,
    name: process.env.ADMIN_NAME,
  },
};
