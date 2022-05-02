require('module-alias/register');
import 'dotenv/config';
import express from 'express';
import config from 'config';
import connectToDb from '@/utils/connectToDb';
import log from '@/utils/logger';
import router from '@/routes/index';
import deserializeUser from './middleware/deserializeUser';
import initialAdmin from './utils/initialAdmin';

const app = express();
const port = config.get('port');

app.use(express.json());
app.use(deserializeUser);
app.use(router);

app.listen(port, async () => {
  log.info(`App started at http://localhost:${port}`);

  await connectToDb();
  await initialAdmin();
});
