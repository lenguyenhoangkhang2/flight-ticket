import express from 'express';
import user from '@/routes/user.routes';
import auth from '@/routes/auth.routes';
import flight from '@/routes/flight.routes';
import seat from '@/routes/seat.routes';

const router = express.Router();

router.get('/healthcheck', (_, res) => res.sendStatus(200));

router.use(user);
router.use(auth);
router.use(seat);
router.use(flight);

export default router;
