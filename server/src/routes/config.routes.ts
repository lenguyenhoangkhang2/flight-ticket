import { getConfigurationHandler, updateConfigurationHandler } from '@/controller/config.controller';
import express from 'express';

const router = express.Router();

router.get('/api/configs', getConfigurationHandler);

router.put('/api/configs', updateConfigurationHandler);

export default router;
