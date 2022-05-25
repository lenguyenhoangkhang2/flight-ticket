import express from 'express';
import user from '@/routes/user.routes';
import auth from '@/routes/auth.routes';
import flight from '@/routes/flight.routes';
import seat from '@/routes/seat.routes';
import airport from '@/routes/airport.routes';
import config from '@/routes/config.routes';
import report from '@/routes/report.routes';

const router = express.Router();

router.get('/healthcheck', (_, res) => res.sendStatus(200));

router.use(auth);
router.use(user);
router.use(config);
router.use(seat);
router.use(airport);
router.use(flight);
router.use(report);

export default router;
