import { Stopover, SeatsOfFlight } from './../model/flight.model';
import { Airport } from '@/model/airport.model';
import FlightModel, { Flight, Ticket } from '@/model/flight.model';
import { DocumentType, isDocument } from '@typegoose/typegoose';
import dayjs from 'dayjs';
import _, { result } from 'lodash';
import { User } from '@/model/user.model';

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
    .populate<{ fromLocation: Airport }>({ path: 'fromLocation', select: '-__v -createdAt -updatedAt' })
    .populate<{ toLocation: Airport }>({ path: 'toLocation', select: '-__v -createdAt -updatedAt' })
    .populate<{ stopovers: Stopover[] }>({ path: 'stopovers.airport', select: '-__v -createdAt -updatedAt' })
    .populate<{ tickets: Ticket[] }>({ path: 'tickets.seatClass', select: '-__v -createdAt -updatedAt' })
    .populate<{ tickets: Ticket[] }>({
      path: 'tickets.user',
      select: '-password -verified -isAdmin -verificationCode -__v -createdAt -updatedAt',
    })
    .populate<{ seats: SeatsOfFlight[] }>({ path: 'seats.type', select: '-__v -createdAt -updatedAt' })
    .select('-__v');
}

export async function addTicketsToFlight(flightId: string, addedTickets: Ticket[]) {
  return FlightModel.findByIdAndUpdate(flightId, { $push: { tickets: { $each: addedTickets } } });
}

export async function getFlightById(flightId: string) {
  return FlightModel.findById(flightId)
    .populate<{ fromLocation: Airport }>({ path: 'fromLocation', select: '-__v -createdAt -updatedAt' })
    .populate<{ toLocation: Airport }>({ path: 'toLocation', select: '-__v -createdAt -updatedAt' })
    .populate<{ stopovers: Stopover[] }>({ path: 'stopovers.airport', select: '-__v -createdAt -updatedAt' })
    .populate<{ tickets: Ticket[] }>({ path: 'tickets.seatClass', select: '-__v' })
    .populate<{ tickets: Ticket[] }>({
      path: 'tickets.user',
      select: '-password -verified -isAdmin -verificationCode -__v -createdAt -updatedAt',
    })
    .populate<{ seats: SeatsOfFlight[] }>({ path: 'seats.type', select: '-__v -createdAt -updatedAt' })
    .select('-__v');
}

export async function getFlightOrderedByUser(userId: string) {
  const flights = await FlightModel.find({
    tickets: {
      $elemMatch: { user: userId },
    },
  })
    .populate({ path: 'fromLocation', select: '-__v -createdAt -updatedAt' })
    .populate({ path: 'toLocation', select: '-__v -createdAt -updatedAt' })
    .populate({ path: 'stopovers.airport', select: '-__v -createdAt -updatedAt' })
    .populate('tickets.user')
    .select('-__v');

  const results = flights.map((flight) => {
    flight.tickets = flight.tickets!.filter((ticket) => {
      if (!isDocument(ticket.user)) {
        throw new Error('tickets.user not doc');
      }

      return ticket.user._id.toString() === userId;
    });

    return flight;
  });

  return results;
}

export async function updateTicketsOrderedToPaidByUserAndFlight(
  user: DocumentType<User>,
  flight: DocumentType<Flight>,
) {
  flight.tickets = flight.tickets!.map((ticket) => {
    if (!isDocument(ticket.user)) {
      throw new Error('tickets.user not doc');
    }

    if (user.equals(ticket.user)) {
      ticket.paid = true;
    }

    return ticket;
  });

  await flight.save();
}
