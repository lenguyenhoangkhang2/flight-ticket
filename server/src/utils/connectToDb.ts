import mongoose from 'mongoose';
import config from 'config';
import log from '@/utils/logger';

async function connectToDb() {
  const dbUsername = config.get<string>('dbUsername');
  const dbPassword = config.get<string>('dbPassword');

  try {
    await mongoose.connect(
      `mongodb+srv://${dbUsername}:${dbPassword}@cluster0.ugzhy.mongodb.net/flightTicketDB?retryWrites=true&w=majority`,
    );

    log.info('Connect to DB');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

export default connectToDb;
