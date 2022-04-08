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
  exeQueries();
});

async function exeQueries() {
  try {
    const user = await UserModel.findOne({ email: 'lenguyenhoangkhang2@gmail.com' });

    if (user) {
      let hanoiAirport, hcmAirport, danangAirport, firstClassSeat;

      hanoiAirport = await AirportModel.findOne({ name: 'Ha Noi' });
      if (!hanoiAirport) {
        hanoiAirport = await AirportModel.create({ name: 'Ha Noi', location: 'Ha Noi, Viet Nam' } as Airport);
      }

      hcmAirport = await AirportModel.findOne({ name: 'Ho Chi Minh' });
      if (!hcmAirport) {
        hcmAirport = await AirportModel.create({
          name: 'Ho Chi Minh',
          location: 'Ho Chi Minh, Viet Nam',
        } as Airport);
      }

      danangAirport = await AirportModel.findOne({ name: 'Da Nang' });
      if (!danangAirport) {
        danangAirport = await AirportModel.create({
          name: 'Da Nang',
          location: 'Da Nang, Viet Nam',
        } as Airport);
      }

      firstClassSeat = await SeatModel.findOne({ className: 'First Class' });
      if (!firstClassSeat) {
        firstClassSeat = await SeatModel.create({ className: 'First Class', extraFee: 5 } as Seat);
      }

      let tickets: Ticket[];

      console.log(firstClassSeat);

      if (firstClassSeat) {
        tickets = [
          {
            user: user._id,
            paid: true,
            price: 105000,
            seat_class: firstClassSeat._id,
          },
        ];

        const flight = await FlightModel.create({
          seats: [{ type: firstClassSeat, amount: 20 }],
          from_location: hcmAirport,
          to_location: hanoiAirport,
          airline_name: 'VietNam Airline',
          departure_time: new Date(),
          arrival_time: new Date(),
          tickets: tickets,
          stopover: [{ airport: danangAirport, deylay: 1800 }],
          price: 100000,
        } as Flight);

        console.log(flight);
      }
    }
  } catch (err) {
    console.log(err);
  }
}
