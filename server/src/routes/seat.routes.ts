import { createSeatHandler, getSeatsHandler, updateSeatHandler } from '@/controller/seat.controller';
import requireAdmin from '@/middleware/requireAdmin';
import validateResource from '@/middleware/validateResourse';
import { createSeatSchema, updateSeatSchema } from '@/schema/seat.schema';
import express from 'express';

const router = express.Router();

router.post('/api/seats', requireAdmin, validateResource(createSeatSchema), createSeatHandler);

router.put('/api/seats/:seatId', requireAdmin, validateResource(updateSeatSchema), updateSeatHandler);

router.get('/api/seats', getSeatsHandler);

export default router;
