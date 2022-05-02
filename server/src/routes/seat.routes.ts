import { createSeatHandler } from '@/controller/seat.controller';
import requireAdmin from '@/middleware/requireAdmin';
import validateResource from '@/middleware/validateResourse';
import { createSeatSchema } from '@/schema/seat.schema';
import express from 'express';

const router = express.Router();

router.post('/api/seats', requireAdmin, validateResource(createSeatSchema), createSeatHandler);

export default router;
