import { number, object, TypeOf } from 'zod';

export const updateConfigSchema = object({
  body: object({
    airportAmountMax: number().nonnegative(),

    seatClassAmountMax: number().nonnegative(),

    flightTimeMin: number().nonnegative(),

    numberStopoverMax: number().nonnegative(),

    timeDelayMin: number().nonnegative(),

    timeDelayMax: number().nonnegative(),

    timeLimitBuyTicket: number().nonnegative(),

    timeLimitCancelTicket: number().nonnegative(),
  }),
});

export type updateConfigInput = TypeOf<typeof updateConfigSchema>['body'];
