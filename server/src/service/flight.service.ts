import { Airport } from '@/model/airport.model';
import FlightModel, { Flight, Ticket } from '@/model/flight.model';
import { Seat } from '@/model/seat.model';
import { DocumentType } from '@typegoose/typegoose';
import dayjs from 'dayjs';

export async function createFlight(flight: Partial<Flight>) {
  return FlightModel.create(flight);
}

export async function addTicketFlight(flightId: string, ticket: DocumentType<Ticket>) {
  console.log(flightId, ticket);
}

export async function existsFlightById(flightId: string) {
  try {
    return await FlightModel.exists({ _id: flightId });
  } catch (err) {
    return null;
  }
}

export async function updateFlightById(flightId: string, flight: Partial<Flight>) {
  return FlightModel.findByIdAndUpdate(flightId, flight);
}

export async function getFlightsByDate(departtureDate: Date) {
  return FlightModel.find({
    departureTime: {
      $gte: dayjs(departtureDate).startOf('day'),
      $lte: dayjs(departtureDate).endOf('day'),
    },
  })
    .lean()
    .populate<{ fromLocation: Airport }>({ path: 'fromLocation', select: 'name location -_id' })
    .populate<{ toLocation: Airport }>({ path: 'toLocation', select: 'name location -_id' })
    .populate<{
      stopovers: {
        airport: Airport;
        delay: number;
        note?: string;
      }[];
    }>({
      path: 'stopovers.airport',
      select: 'name location -_id',
    })
    .populate<{
      seats: {
        type: Seat;
        amount: number;
      }[];
    }>({
      path: 'seats.type',
      select: 'className extraFee -_id',
    });
}
