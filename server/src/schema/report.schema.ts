import { object, string, TypeOf } from 'zod';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import dayjs from 'dayjs';

dayjs.extend(isSameOrAfter);

export const createMonthReportSchema = object({
  body: object({
    time: string({
      required_error: 'Time for create report required',
    })
      .min(1, { message: 'Time for create report required' })
      .refine((value) => Date.parse(value), {
        message: "Can't parse to date",
      })
      .transform((value) => new Date(value))
      .refine((value) => dayjs().isSameOrAfter(value, 'month'), {
        message: 'Invalid date time to create month report',
      }),
  }),
});

export const createYearReportSchema = object({
  body: object({
    time: string({
      required_error: 'Time for create report required',
    })
      .min(1, { message: 'Time for create report required' })
      .refine((value) => Date.parse(value), {
        message: "Can't parse to date",
      })
      .transform((value) => new Date(value))
      .refine((value) => dayjs().isSameOrAfter(value, 'year'), {
        message: 'Invalid date time to create year report',
      }),
  }),
});

export const updateMonthReportSchama = object({
  params: object({
    reportId: string(),
  }),
});

export const updateYearReportSchama = updateMonthReportSchama;

export const deleteYearReportSchama = updateMonthReportSchama;

export const deleteMonthReportSchama = updateMonthReportSchama;

export type createMonthReportInput = TypeOf<typeof createMonthReportSchema>['body'];

export type createYearReportInput = TypeOf<typeof createYearReportSchema>['body'];

export type updateMonthReportParams = TypeOf<typeof updateMonthReportSchama>['params'];

export type updateYearReportParams = TypeOf<typeof updateYearReportSchama>['params'];

export type deleteMonthReportParams = TypeOf<typeof deleteMonthReportSchama>['params'];

export type deleteYearReportParams = TypeOf<typeof deleteYearReportSchama>['params'];
