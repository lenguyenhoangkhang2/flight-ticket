import { createAirportHandler, getAirportsHandler, updateAirportHandler } from '@/controller/airport.controller';
import requireAdmin from '@/middleware/requireAdmin';
import validateResource from '@/middleware/validateResourse';
import { createAirportSchema, updateAirportSchema } from '@/schema/airport.schema';
import express from 'express';

const router = express.Router();

router.post('/api/airports', requireAdmin, validateResource(createAirportSchema), createAirportHandler);

router.put('/api/airports/:airportId', requireAdmin, validateResource(updateAirportSchema), updateAirportHandler);

router.get('/api/airports', getAirportsHandler);

export default router;
