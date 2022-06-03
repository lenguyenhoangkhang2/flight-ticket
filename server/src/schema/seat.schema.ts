import { existsBySeatClassname, existsBySeatId } from '@/service/seat.service';
import { number, object, string, TypeOf } from 'zod';

export const createSeatSchema = object({
  body: object({
    className: string({
      required_error: 'Class name is required',
    })
      .min(1, {
        message: 'Class name is required',
      })
      .refine(async (val) => !(await existsBySeatClassname(val)), {
        message: 'Class name is exist',
      }),

    extraFee: number({
      required_error: 'Extra fee is required',
    })
      .nonnegative({
        message: 'Extra fee must greater than or equal to 0',
      })
      .max(100, {
        message: 'Extra fee must lower than or equal to 100',
      }),
  }),
});

export const updateSeatSchema = object({
  params: object({
    seatId: string({
      required_error: 'Seat id is required',
    }).refine(async (val) => !!(await existsBySeatId(val)), {
      message: 'Not found seat class with Id',
    }),
  }),
  body: object({
    className: string({
      required_error: 'Class name is required',
    }).min(1, {
      message: 'Class name is required',
    }),

    extraFee: number({
      required_error: 'Extra fee is required',
    })
      .nonnegative({
        message: 'Extra fee must greater than or equal to 0',
      })
      .max(100, {
        message: 'Extra fee must lower than or equal to 100',
      }),
  }),
});

export type createSeatInput = TypeOf<typeof createSeatSchema>['body'];

export type updateSeatInput = TypeOf<typeof updateSeatSchema>['body'];

export type verifySeatIdInput = TypeOf<typeof updateSeatSchema>['params'];
