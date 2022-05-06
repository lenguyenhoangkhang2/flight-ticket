import { existsByAirportName, existsByAirportId } from '@/service/airport.service';
import { object, string, TypeOf } from 'zod';

export const createAirportSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }).refine(async (val) => !(await existsByAirportName(val)), {
      message: 'Class name is exist',
    }),

    location: string({
      required_error: 'Location is required',
    }),
  }),
});

export const updateAirportSchema = object({
  params: object({
    airportId: string({
      required_error: 'Airport id is required',
    }).refine(async (val) => !!(await existsByAirportId(val)), {
      message: 'Not found airport with Id',
    }),
  }),
  body: createAirportSchema.shape.body.extend({
    name: string({
      required_error: 'Name is required',
    }),
  }),
});

export type createAirportInput = TypeOf<typeof createAirportSchema>['body'];

export type updateAirportInput = TypeOf<typeof updateAirportSchema>['body'];

export type verifyAirportIdInput = TypeOf<typeof updateAirportSchema>['params'];
