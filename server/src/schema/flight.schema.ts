import { isAirportExist } from '@/service/airport.service';
import { isSeatExist } from '@/service/seat.service';
import { number, object, string, TypeOf } from 'zod';
import _ from 'lodash';

export const createFlightSchema = object({
  body: object({
    airline: string({
      required_error: 'Airline is required',
    }),

    fromLocation: string({
      required_error: 'From Location is required',
    }).refine(async (val) => !!(await isAirportExist(val)), { message: 'Invalid location' }),

    toLocation: string({
      required_error: 'To Location is required',
    }).refine(async (val) => !!(await isAirportExist(val)), {
      message: 'Invalid location',
    }),

    departureTime: string({
      required_error: 'Departure Time is required',
    })
      .transform((val) => new Date(val))
      .refine((val) => val > new Date(), { message: 'Departure time is past' }),

    arrivalTime: string({
      required_error: 'Arrival Time is required',
    })
      .transform((val) => new Date(val))
      .refine((val) => val > new Date(), { message: 'Arrival time is past' }),

    price: number({
      required_error: 'Price is required',
    }).min(0, { message: 'Invalid price' }),

    seats: object({
      type: string({
        required_error: 'Type of seat is required',
      }).refine(async (val) => !!(await isSeatExist(val)), {
        message: 'Seat type not exist',
      }),
      amount: number({
        required_error: 'Amount of seat is required',
      }).min(1, 'Seat amount must greater than 0'),
    })
      .array()
      .min(1)
      .refine((val) => val.length === _.uniqBy(val, 'type').length, {
        message: 'Exist duplicate seat type',
      }),

    timeForPaymentTicket: string({
      required_error: 'Time for payment ticket is required',
    }).transform((val) => new Date(val)),
  })
    .refine(({ departureTime, arrivalTime }) => departureTime < arrivalTime, {
      message: 'Departure time must before Arrival time',
    })
    .refine(({ fromLocation, toLocation }) => fromLocation !== toLocation, {
      message: 'fromLocation must diffirent toLocation',
    }),
});

export type createFlightInput = TypeOf<typeof createFlightSchema>['body'];
