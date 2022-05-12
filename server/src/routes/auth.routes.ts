import { createSessionHandler, deleteSessionHandler, refreshAccessTokenHandler } from '@/controller/auth.controller';
import requireUser from '@/middleware/requireUser';
import validateResource from '@/middleware/validateResourse';
import { createSessionSchema } from '@/schema/auth.schema';
import express from 'express';

const router = express.Router();

router.post('/api/sessions', validateResource(createSessionSchema), createSessionHandler);

router.post('/api/sessions/refresh', refreshAccessTokenHandler);

router.post('/api/sessions/logout', requireUser, deleteSessionHandler);

export default router;
