import { createFlightInput, getFlightsInput, updateFlightInput } from '@/schema/flight.schema';
import { getConfigrugationValue } from '@/service/config.service';
import { createFlight, getFlightsByDate, updateFlightById } from '@/service/flight.service';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Request, Response } from 'express';
import _ from 'lodash';

dayjs.extend(duration);

export async function getFlightsHandler(req: Request<any, any, any, getFlightsInput['query']>, res: Response) {
  try {
    const { departureDate } = req.query;

    const flights = await getFlightsByDate(new Date(departureDate));

    res.send(_.map(flights, (flight) => _.omit(flight, ['tickets', '__v', 'createdAt', 'updatedAt'])));
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function createFlightHandler(req: Request<any, any, createFlightInput>, res: Response) {
  try {
    const config = await getConfigrugationValue();

    if (!config) throw new Error('Configuration environment variable not found');

    const flightData = req.body;

    const validateErrors = [];

    // Check Flight Duration is valid ?
    const flightDuration = dayjs(flightData.arrivalTime).diff(flightData.departureTime, 's'); // console.log(dayjs.duration(flightDuration * 1000).hours());

    if (flightDuration < config.flightTimeMin) {
      validateErrors.push({
        message: 'Flight Duration is too small',
        path: ['arrivalTime'],
      });
    }

    // Check Stopover delay is valid ?
    flightData.stopovers.forEach(({ delay }, i) => {
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

    if (validateErrors.length) return res.status(400).send(validateErrors);

    const flight = await createFlight({
      ...flightData,
      timeForPaymentTicket: dayjs(flightData.departureTime)
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
    const { flightId } = req.params;
    await updateFlightById(flightId, req.body);

    res.send('Flight successfully updated');
  } catch (err: any) {
    res.status(500).send(err.message);
  }
}
