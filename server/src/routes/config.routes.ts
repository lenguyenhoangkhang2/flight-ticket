import { getConfigurations } from '@/controller/config.controller';
import express from 'express';

const router = express.Router();

router.get('/api/configs', getConfigurations);

export default router;
