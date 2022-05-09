import { existsBySeatId } from '@/service/seat.service';
import { any, array, number, object, string, TypeOf } from 'zod';
import _ from 'lodash';
import { existsByAirportId } from '@/service/airport.service';
import { existsFlightById } from '@/service/flight.service';

const flightId = string({
  required_error: 'Flight Id is required',
}).refine(
  async (val) => !!(await existsFlightById(val)),
  (val) => ({ message: `Not found flight with id ${val}` }),
);

export const createFlightSchema = object({
  body: object({
    airline: string({
      required_error: 'Airline is required',
    }),

    fromLocation: any({
      required_error: 'From Location is required',
    }).refine(async (val) => !!(await existsByAirportId(val)), {
      message: 'Airport location not found',
    }),

    toLocation: any({
      required_error: 'To Location is required',
    }).refine(async (val) => !!(await existsByAirportId(val)), {
      message: 'Airport location not found',
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

    stopovers: array(
      object({
        airport: string({
          required_error: 'Stopover location required',
        }).refine(async (val) => !!(await existsByAirportId(val)), {
          message: 'Airport location not found',
        }),
        delay: number({
          required_error: 'Stopover delay required',
        }),
        note: string().optional(),
      }),
    ).default([]),

    seats: object({
      type: string({
        required_error: 'Type of seat is required',
      }).refine(async (val) => !!(await existsBySeatId(val)), {
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
  })
    .refine(({ departureTime, arrivalTime }) => departureTime < arrivalTime, {
      message: 'Departure time must before Arrival time',
    })
    .refine(({ fromLocation, toLocation }) => fromLocation !== toLocation, {
      message: 'fromLocation must diffirent toLocation',
    })
    .refine(
      ({ fromLocation, toLocation, stopovers }) => {
        const index = stopovers.findIndex(({ airport }) => airport === fromLocation || airport === toLocation);
        return index === -1;
      },
      { message: 'Exists Stopover identical with fromLocation or toLocation', path: ['stopovers'] },
    ),
});

export const updateFlightSchema = object({
  params: object({
    flightId,
  }),
  body: createFlightSchema.shape.body,
});

export const getFlightsSchema = object({
  query: object({
    departureDate: string({
      required_error: 'Deaparture Date is required',
    }).refine((val) => Date.parse(val), { message: 'Invalid Date' }),
  }),
});

export const addFlightTicketSchema = object({
  params: object({
    flightId,
  }),
  body: array(
    object({
      seatClassId: string({
        required_error: 'Type of seat is required',
      }),
      amount: number({
        required_error: 'Amount of tickets is required',
      }).nonnegative(),
    }),
  )
    .min(1)
    .refine((val) => val.length === _.uniqBy(val, 'seatClassId').length, {
      message: 'Exist duplicate seat class',
    }),
});

export const getFlightShema = object({
  params: object({
    flightId,
  }),
});

export const updateTicketsToPaidSchema = object({
  params: object({
    userId: string({
      required_error: 'User Id is required',
    }),
    flightId,
  }),
});

export type createFlightInput = TypeOf<typeof createFlightSchema>['body'];

export type updateFlightInput = TypeOf<typeof updateFlightSchema>;

export type getFlightsInput = TypeOf<typeof getFlightsSchema>;

export type updateTicketsToPaidInput = TypeOf<typeof updateTicketsToPaidSchema>['params'];

export type addFlightTicketInput = TypeOf<typeof addFlightTicketSchema>;

export type getFlightInput = TypeOf<typeof getFlightShema>['params'];
