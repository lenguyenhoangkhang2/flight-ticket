import {
  addTicketsFlightHandler,
  createFlightHandler,
  getFlightHandler,
  getFlightsHandler,
  getFlightsOrderedHandler,
  updateFlightHandler,
  updateTicketsOrderedToPaidHandler,
} from '@/controller/flight.controller';
import requireAdmin from '@/middleware/requireAdmin';
import requireUser from '@/middleware/requireUser';
import validateResource from '@/middleware/validateResourse';
import {
  addFlightTicketSchema,
  createFlightSchema,
  getFlightShema,
  getFlightsSchema,
  updateFlightSchema,
} from '@/schema/flight.schema';
import express from 'express';

const router = express.Router();

router.post('/api/flights', requireAdmin, validateResource(createFlightSchema), createFlightHandler);

router.put('/api/flights/:flightId', requireAdmin, validateResource(updateFlightSchema), updateFlightHandler);

router.get('/api/flights', validateResource(getFlightsSchema), getFlightsHandler);

router.get('/api/flights/:flightId', validateResource(getFlightShema), getFlightHandler);

router.post(
  '/api/flights/:flightId/tickets',
  requireUser,
  validateResource(addFlightTicketSchema),
  addTicketsFlightHandler,
);

router.get('/api/flights/tickets/me', requireUser, getFlightsOrderedHandler);

router.put('/api/flights/:flightId/tickets/paid/:userId', requireAdmin, updateTicketsOrderedToPaidHandler);

export default router;
