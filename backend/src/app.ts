require('module-alias/register');
require('dotenv').config();
import express from 'express';
import config from 'config';
import connectToDb from '@/utils/connectToDb';
import log from '@/utils/logger';
import router from '@/routes/index';
import deserializeUser from './middleware/deserializeUser';

const app = express();

app.use(express.json());
app.use(deserializeUser);
app.use(router);

const port = config.get('port');

app.listen(port, () => {
  log.info(`App started at http://localhost:${port}`);

  connectToDb();
  // exeQueries();
});

// async function exeQueries() {
//   try {
//     const hanoiAirport = await AirportModel.findOne({ name: 'Ha Noi' });
//     const hcmAirport = await AirportModel.findOne({ name: 'Ho Chi Minh' });
//     if (hanoiAirport && hcmAirport) {
//       await FlightModel.create({
//         seat: {
//           first_class: 20,
//           second_class: 50,
//         },
//         to_location: hanoiAirport,
//         from_location: hcmAirport,
//         airline_name: 'VietNam Airline',
//         arrival_time: new Date(),
//         departure_time: new Date(),
//       } as Flight);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
