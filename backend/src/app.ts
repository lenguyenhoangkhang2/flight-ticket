require('module-alias/register');
import 'dotenv/config';
import express from 'express';
import config from 'config';
import connectToDb from '@/utils/connectToDb';
import log from '@/utils/logger';
import router from '@/routes/index';
import deserializeUser from './middleware/deserializeUser';
import AirportModel, { Airport } from './model/airport.model';
import FlightModel, { Flight, Ticket } from './model/flight.model';
import SeatModel, { Seat } from './model/seat.model';
import UserModel, { User } from './model/user.model';

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
//     const user = await UserModel.findOne({ email: 'lenguyenhoangkhang2@gmail.com' });

//     if (user) {
//       const hanoiAirport = await AirportModel.create({ name: 'Ha Noi', location: 'Ha Noi, Viet Nam' } as Airport);
//       const hcmAirport = await AirportModel.create({
//         name: 'Ho Chi Minh',
//         location: 'Ho Chi Minh, Viet Nam',
//       } as Airport);

//       const firstClassSeat = await SeatModel.create({ className: 'First Class', extraFee: 5 } as Seat);

//       const tickets: Ticket[] = [
//         {
//           user: user._id,
//           paid: true,
//           price: 105000,
//           seat_class: firstClassSeat._id,
//         },
//       ];

//       await FlightModel.create({
//         seats: ,
//         from_location: hcmAirport,
//         to_location: hanoiAirport,
//         airline_name: 'VietNam Airline',
//         departure_time: new Date(),
//         arrival_time: new Date(),
//         tickets: tickets,
//       } as Flight);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }
