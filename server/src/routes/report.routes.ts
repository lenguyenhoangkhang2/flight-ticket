import {
  createMonthReportHandler,
  createYearReportHandler,
  deleteMonthReportHandle,
  deleteYearReportHandle,
  getMonthReportHandler,
  getYearReportHandler,
  updateMonthReportHandler,
  updateYearReportHandler,
} from '@/controller/report.controller';
import requireAdmin from '@/middleware/requireAdmin';
import validateResource from '@/middleware/validateResourse';
import {
  createMonthReportSchema,
  createYearReportSchema,
  deleteMonthReportSchama,
  deleteYearReportSchama,
  updateMonthReportSchama,
  updateYearReportSchama,
} from '@/schema/report.schema';
import express from 'express';

const router = express.Router();

router.post('/api/reports/month', requireAdmin, validateResource(createMonthReportSchema), createMonthReportHandler);

router.post('/api/reports/year', requireAdmin, validateResource(createYearReportSchema), createYearReportHandler);

router.get('/api/reports/month', requireAdmin, getMonthReportHandler);

router.get('/api/reports/year', requireAdmin, getYearReportHandler);

router.put(
  '/api/reports/month/:reportId',
  requireAdmin,
  validateResource(updateMonthReportSchama),
  updateMonthReportHandler,
);

router.put(
  '/api/reports/year/:reportId',
  requireAdmin,
  validateResource(updateYearReportSchama),
  updateYearReportHandler,
);

router.delete(
  '/api/reports/month/:reportId',
  requireAdmin,
  validateResource(deleteMonthReportSchama),
  deleteMonthReportHandle,
);

router.delete(
  '/api/reports/year/:reportId',
  requireAdmin,
  validateResource(deleteYearReportSchama),
  deleteYearReportHandle,
);

export default router;
