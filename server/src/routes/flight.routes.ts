import { createFlightHandler, getFlightsHandler, updateFlightHandler } from '@/controller/flight.controller';
import requireAdmin from '@/middleware/requireAdmin';
import validateResource from '@/middleware/validateResourse';
import { createFlightSchema, getFlightsSchema, updateFlightSchema } from '@/schema/flight.schema';
import express from 'express';

const router = express.Router();

router.post('/api/flights', requireAdmin, validateResource(createFlightSchema), createFlightHandler);

router.put('/api/flights/:flightId', requireAdmin, validateResource(updateFlightSchema), updateFlightHandler);

router.get('/api/flights', validateResource(getFlightsSchema), getFlightsHandler);

export default router;
