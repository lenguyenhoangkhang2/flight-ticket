import { isClassnameExist } from '@/service/seat.service';
import { number, object, string, TypeOf } from 'zod';

export const createSeatSchema = object({
  body: object({
    className: string({
      required_error: 'Class name is required',
    }).refine(async (val) => !(await isClassnameExist(val)), {
      message: 'Class name is exist',
    }),

    extraFee: number({
      required_error: 'Extra fee is required',
    })
      .min(0, {
        message: 'Extra fee must greater than or equal to 0',
      })
      .max(100, {
        message: 'Extra fee must lower than or equal to 100',
      }),
  }),
});

export type createSeatInput = TypeOf<typeof createSeatSchema>['body'];
