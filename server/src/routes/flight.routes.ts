import { createFlightHandler } from '@/controller/flight.controller';
import requireAdmin from '@/middleware/requireAdmin';
import validateResource from '@/middleware/validateResourse';
import { createFlightSchema } from '@/schema/flight.schema';
import express from 'express';

const router = express.Router();

router.post('/api/flight', requireAdmin, validateResource(createFlightSchema), createFlightHandler);

export default router;
