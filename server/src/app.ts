require('module-alias/register');
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import config from 'config';
import connectToDb from '@/utils/connectToDb';
import log from '@/utils/logger';
import router from '@/routes/index';
import deserializeUser from './middleware/deserializeUser';
import initialAdmin from './utils/initialAdmin';
import initialConfig from './utils/initialConfig';
import * as cron from 'node-cron';
import { cancelExpiredTickets } from './service/flight.service';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { stripeWebHookHandler } from './controller/webhook.controller';

const app = express();

app.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebHookHandler);

app.use(
  cors({
    credentials: true,
    origin: [config.get<string>('clientHost')],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(deserializeUser);
app.use(router);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send({
    message: err.message,
  });
});

const port = config.get('port');

app.listen(port, async () => {
  log.info(`App started at http://localhost:${port}`);

  await connectToDb();
  await initialAdmin();
  await initialConfig();

  await cancelExpiredTickets();
  cron.schedule('* * * * *', async () => {
    await cancelExpiredTickets();
  });
});
