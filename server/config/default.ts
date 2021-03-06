export default {
  port: 8080,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  logLevel: 'info',
  accessTokenTtl: '15m',
  refreshTokenTtl: '1y',
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
  initialConfig: {
    airportAmountMax: process.env.AIRPORT_AMOUNT_MAX,
    seatClassAmountMax: process.env.SEATCLASS_AMOUNT_MAX,
    flightTimeMin: process.env.FLIGHT_TIME_MIN,
    numberStopoverMax: process.env.NUMBER_STOPOVER_MAX,
    timeDelayMin: process.env.TIME_DELAY_MIN,
    timeDelayMax: process.env.TIME_DELAY_MAX,
    timeLimitBuyTicket: process.env.TIME_LIMIT_BUY_TICKET,
    timeLimitCancelTicket: process.env.TIME_LIMIT_CANCEL_TICKET,
  },
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  clientHost: process.env.CLIENT_HOST,
  stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
  stripeSessionExpiresTime: process.env.STRIPE_SESSION_EXPIRES_TIME,
};
