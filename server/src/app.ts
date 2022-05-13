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

const app = express();
const port = config.get('port');

app.use(cors());
app.use(express.json());
app.use(deserializeUser);
app.use(router);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send({
    message: err.message,
  });
});

app.listen(port, async () => {
  log.info(`App started at http://localhost:${port}`);
  console.log('Server listening on port ' + port);

  await connectToDb();
  await initialAdmin();
  await initialConfig();

  cron.schedule('* * * * *', async () => {
    await cancelExpiredTickets();
  });
});
