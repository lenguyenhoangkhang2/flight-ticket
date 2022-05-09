import { Ticket } from '@/model/flight.model';
import {
  addFlightTicketInput,
  createFlightInput,
  getFlightInput,
  getFlightsInput,
  updateFlightInput,
  updateTicketsToPaidInput,
} from '@/schema/flight.schema';
import { getConfigrugationValue } from '@/service/config.service';
import {
  addTicketsToFlight,
  createFlight,
  getFlightById,
  getFlightsByDate,
  getFlightOrderedByUser,
  updateFlightById,
  updateTicketsOrderedToPaidByUserAndFlight,
} from '@/service/flight.service';
import { getSeatClassById } from '@/service/seat.service';
import { DocumentType, isDocument } from '@typegoose/typegoose';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { findAirportById } from '@/service/airport.service';
import { Airport } from '@/model/airport.model';
import { Seat } from '@/model/seat.model';
import _ from 'lodash';
import { findUserById } from '@/service/user.service';

dayjs.extend(duration);

export async function getFlightsHandler(req: Request<any, any, any, getFlightsInput['query']>, res: Response) {
  try {
    const { departureDate } = req.query;

    const flights = await getFlightsByDate(new Date(departureDate));

    if (!res.locals.user?.isAdmin) {
      return res.send(flights.map((flight) => _.omit(flight.toObject(), ['tickets'])));
    }

    res.send(flights);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getFlightHandler(req: Request<getFlightInput>, res: Response) {
  try {
    const { flightId } = req.params;

    const flight = await getFlightById(flightId);

    if (!flight) throw new Error('Flight not found');

    if (!res.locals.user?.isAdmin) {
      console.log(flight.toJSON());
      return res.send(_.omit(flight.toJSON(), ['tickets']));
    }

    res.send(flight);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}

export async function createFlightHandler(req: Request<any, any, createFlightInput>, res: Response) {
  try {
    const config = await getConfigrugationValue();

    if (!config) throw new Error('Configuration environment variable not found');

    const validateErrors = [];

    // Check Flight Duration is valid ?
    const flightDuration = dayjs(req.body.arrivalTime).diff(req.body.departureTime, 's');

    if (flightDuration < config.flightTimeMin) {
      validateErrors.push({
        message: 'Flight Duration is too small',
        path: ['arrivalTime'],
      });
    }

    // Check Stopover delay is valid ?
    req.body.stopovers.forEach(({ delay }, i) => {
      if (delay < config.timeDelayMin) {
        validateErrors.push({
          message: 'Time delay is too short',
          path: ['stopovers', i, 'delay'],
        });
      } else if (delay > config.timeDelayMax) {
        validateErrors.push({
          message: 'Time delay is too long',
          path: ['stopovers', i, 'delay'],
        });
      }
    });

    const fromLocation = (await findAirportById(req.body.fromLocation)) as Airport;

    const toLocation = (await findAirportById(req.body.toLocation)) as Airport;

    const stopovers = await Promise.all(
      req.body.stopovers.map(async (stopover) => {
        const airport = await findAirportById(stopover.airport);

        return {
          ...stopover,
          airport: airport as Airport,
        };
      }),
    );

    const seats = await Promise.all(
      req.body.seats.map(async (seat) => {
        const seatClass = await getSeatClassById(seat.type);

        return {
          ...seat,
          type: seatClass as Seat,
        };
      }),
    );

    if (validateErrors.length) return res.status(400).send(validateErrors);

    const flight = await createFlight({
      ...req.body,
      fromLocation,
      toLocation,
      stopovers,
      seats,
      timeForPaymentTicket: dayjs(req.body.departureTime)
        .subtract(config?.timeLimitCancelTicket, 'day')
        .startOf('day')
        .toDate(),
    });

    res.status(201).send(flight);
  } catch (err: any) {
    res.status(500).send({
      message: err.message,
    });
  }
}

export async function updateFlightHandler(
  req: Request<updateFlightInput['params'], any, updateFlightInput['body']>,
  res: Response,
) {
  try {
    const config = await getConfigrugationValue();

    if (!config) throw new Error('Configuration environment variable not found');

    const validateErrors = [];

    // Check Flight Duration is valid ?
    const flightDuration = dayjs(req.body.arrivalTime).diff(req.body.departureTime, 's'); // console.log(dayjs.duration(flightDuration * 1000).hours());

    if (flightDuration < config.flightTimeMin) {
      validateErrors.push({
        message: 'Flight Duration is too small',
        path: ['arrivalTime'],
      });
    }

    // Check Stopover delay is valid ?
    req.body.stopovers.forEach(({ delay }, i) => {
      if (delay < config.timeDelayMin) {
        validateErrors.push({
          message: 'Time delay is too short',
          path: ['stopovers', i, 'delay'],
        });
      } else if (delay > config.timeDelayMax) {
        validateErrors.push({
          message: 'Time delay is too long',
          path: ['stopovers', i, 'delay'],
        });
      }
    });

    const fromLocation = (await findAirportById(req.body.fromLocation)) as Airport;

    const toLocation = (await findAirportById(req.body.toLocation)) as Airport;

    const stopovers = await Promise.all(
      req.body.stopovers.map(async (stopover) => {
        const airport = await findAirportById(stopover.airport);

        return {
          ...stopover,
          airport: airport as Airport,
        };
      }),
    );

    const seats = await Promise.all(
      req.body.seats.map(async (seat) => {
        const seatClass = await getSeatClassById(seat.type);

        return {
          ...seat,
          type: seatClass as Seat,
        };
      }),
    );

    if (validateErrors.length) return res.status(400).send(validateErrors);

    const { flightId } = req.params;

    await updateFlightById(flightId, {
      ...req.body,
      fromLocation,
      toLocation,
      stopovers,
      seats,
      timeForPaymentTicket: dayjs(req.body.departureTime)
        .subtract(config?.timeLimitCancelTicket, 'day')
        .startOf('day')
        .toDate(),
    });

    res.send('Flight successfully updated');
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}

export async function addTicketsFlightHandler(
  req: Request<addFlightTicketInput['params'], any, addFlightTicketInput['body']>,
  res: Response,
) {
  try {
    const { flightId } = req.params;

    const flight = await getFlightById(flightId);

    if (!flight) throw new Error('Flight not found');

    const seatsOfFlight = flight.seats.map((seat) => {
      if (!isDocument(seat.type)) {
        throw new Error('Type not doc');
      }

      seat.type as DocumentType<Seat>;

      return {
        type: seat.type._id,
        extraFee: seat.type.extraFee,
        amount: seat.amount,
      };
    });

    const ticketsOfFlight = flight.tickets.map((ticket) => {
      if (!isDocument(ticket.seatClass)) {
        throw new Error('seatClass not doc');
      }

      return {
        seatClass: ticket.seatClass._id,
        isValid: ticket.isValid,
      };
    });

    const validateErrors = new ZodError([]);

    req.body.forEach(({ seatClassId: ticketSeatClassId, amount: ticketsAmount }, i) => {
      const seatOfFlight = seatsOfFlight[seatsOfFlight.findIndex((seat) => seat.type.toString() === ticketSeatClassId)];

      if (!seatOfFlight) {
        validateErrors.addIssue({
          code: 'custom',
          message: 'Seat Class is not exist in Flight',
          path: ['body', i, 'seatClassId'],
        });
      } else {
        const seatsOrderedAmount = ticketsOfFlight.filter(({ seatClass, isValid }) => {
          return seatClass.toString() === ticketSeatClassId && isValid;
        }).length;

        if (seatsOrderedAmount + ticketsAmount > seatOfFlight.amount) {
          validateErrors.addIssue({
            code: 'custom',
            message: 'Remaining seats not enought',
            path: ['body', i, 'amount'],
          });
        }
      }
    });

    if (!validateErrors.isEmpty) return res.status(400).send(validateErrors.issues);

    const tickets: Ticket[] = [];

    req.body.map(async ({ seatClassId, amount }) => {
      const seatOfFlight = seatsOfFlight[seatsOfFlight.findIndex((seat) => seat.type.toString() === seatClassId)];

      for (let i = 0; i < amount; i++) {
        const ticket = new Ticket();

        ticket.seatClass = seatOfFlight.type;
        ticket.user = res.locals.user._id;
        ticket.price = +((flight.price * (100 + seatOfFlight.extraFee)) / 100).toFixed(2);

        tickets.push(ticket);
      }
    });

    await addTicketsToFlight(flightId, tickets);

    res.status(201).send('Tickets is successfully added. Please payment before the due time');
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}

export async function getFlightsOrderedHandler(req: Request, res: Response) {
  try {
    const userId = res.locals.user._id;

    const flights = await getFlightOrderedByUser(userId);

    const result = flights.map((flight) => {
      const leanFlight = flight.toObject();

      return {
        ...leanFlight,
        tickets: leanFlight.tickets?.map((ticket) => _.omit(ticket, ['user', '__v'])),
      };
    });

    res.send(result);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}

export async function updateTicketsOrderedToPaidHandler(req: Request<updateTicketsToPaidInput>, res: Response) {
  try {
    const { flightId, userId } = req.params;

    const validateErrors = [];

    const flight = await getFlightById(flightId);
    const user = await findUserById(userId);

    if (!flight) {
      validateErrors.push({
        path: ['params', 'flightId'],
      });
    }

    if (!user) {
      validateErrors.push({
        path: ['params', 'user'],
      });
    }

    if (validateErrors.length) return res.status(400).send(validateErrors);

    await updateTicketsOrderedToPaidByUserAndFlight(user!, flight!);

    res.send('Update tickets ordered to paid successfully!');
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}
