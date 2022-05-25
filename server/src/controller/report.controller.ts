import { MonthReportModel, YearReportModel } from '@/model/report.model';
import {
  createMonthReportInput,
  createYearReportInput,
  deleteMonthReportParams,
  deleteYearReportParams,
  updateMonthReportParams,
  updateYearReportParams,
} from '@/schema/report.schema';
import {
  createMonthReport,
  createYearReport,
  deleteMonthReport,
  deleteYearReport,
  isExistMonthReport,
  isExistYearReport,
  updateMonthReport,
  updateYearReport,
} from '@/service/report.service';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

export async function createMonthReportHandler(req: Request<any, any, createMonthReportInput>, res: Response) {
  const time = req.body.time;
  const isRpExist = await isExistMonthReport(time);

  if (isRpExist) {
    return res.status(400).send([
      {
        path: ['body', 'time'],
        message: `Month report for ${dayjs(time).month() + 1}-${dayjs(time).year()} is exist`,
      },
    ]);
  }

  const report = await createMonthReport(time);

  res.send(report);
}

export async function createYearReportHandler(req: Request<any, any, createYearReportInput>, res: Response) {
  const time = req.body.time;
  const isRpExist = await isExistYearReport(time);

  if (isRpExist) {
    return res.status(400).send([
      {
        path: ['body', 'time'],
        message: `Year report for ${dayjs(time).year()} is exist`,
      },
    ]);
  }

  const report = await createYearReport(time);

  res.send(report);
}

export async function getMonthReportHandler(req: Request, res: Response) {
  const reports = await MonthReportModel.find({});

  res.send(reports);
}

export async function getYearReportHandler(req: Request, res: Response) {
  const reports = await YearReportModel.find({});

  res.send(reports);
}

export async function updateMonthReportHandler(req: Request<updateMonthReportParams>, res: Response) {
  const reportId = req.params.reportId;

  const report = await updateMonthReport(reportId);

  res.send(report);
}

export async function updateYearReportHandler(req: Request<updateYearReportParams>, res: Response) {
  const reportId = req.params.reportId;

  const report = await updateYearReport(reportId);

  res.send(report);
}

export async function deleteMonthReportHandle(req: Request<deleteMonthReportParams>, res: Response) {
  const reportId = req.params.reportId;

  await deleteMonthReport(reportId);

  res.sendStatus(200);
}

export async function deleteYearReportHandle(req: Request<deleteYearReportParams>, res: Response) {
  const reportId = req.params.reportId;

  await deleteYearReport(reportId);

  res.sendStatus(200);
}
