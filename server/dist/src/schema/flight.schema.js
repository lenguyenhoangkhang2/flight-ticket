"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckoutSessionSchema = exports.updateTicketsToPaidSchema = exports.getFlightShema = exports.addFlightTicketSchema = exports.getFlightsSchema = exports.updateFlightSchema = exports.createFlightSchema = void 0;
const seat_service_1 = require("@/service/seat.service");
const zod_1 = require("zod");
const lodash_1 = __importDefault(require("lodash"));
const airport_service_1 = require("@/service/airport.service");
const flight_service_1 = require("@/service/flight.service");
const flightId = (0, zod_1.string)({
    required_error: 'Flight Id is required',
}).refine(async (val) => !!(await (0, flight_service_1.existsFlightById)(val)), (val) => ({ message: `Not found flight with id ${val}` }));
exports.createFlightSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        airline: (0, zod_1.string)({
            required_error: 'Airline is required',
        }).nonempty({ message: 'Airline name is required' }),
        fromLocation: (0, zod_1.any)({
            required_error: 'From Location is required',
        }).refine(async (val) => !!(await (0, airport_service_1.existsByAirportId)(val)), {
            message: 'Airport location not found',
        }),
        toLocation: (0, zod_1.any)({
            required_error: 'To Location is required',
        }).refine(async (val) => !!(await (0, airport_service_1.existsByAirportId)(val)), {
            message: 'Airport location not found',
        }),
        departureTime: (0, zod_1.string)({
            required_error: 'Departure Time is required',
        })
            .transform((val) => new Date(val))
            .refine((val) => val > new Date(), { message: 'Departure time is past' }),
        arrivalTime: (0, zod_1.string)({
            required_error: 'Arrival Time is required',
        })
            .transform((val) => new Date(val))
            .refine((val) => val > new Date(), { message: 'Arrival time is past' }),
        price: (0, zod_1.number)({
            required_error: 'Price is required',
        }).min(1, { message: 'Invalid price' }),
        stopovers: (0, zod_1.array)((0, zod_1.object)({
            airport: (0, zod_1.string)({
                required_error: 'Stopover location required',
            }).refine(async (val) => !!(await (0, airport_service_1.existsByAirportId)(val)), {
                message: 'Airport location not found',
            }),
            delay: (0, zod_1.number)({
                required_error: 'Stopover delay required',
            }),
            note: (0, zod_1.string)().optional(),
        }))
            .default([])
            .refine((val) => val.length === lodash_1.default.uniqBy(val, 'airport').length, {
            message: 'Exist duplicate stopovers location',
        }),
        seats: (0, zod_1.object)({
            type: (0, zod_1.string)({
                required_error: 'Type of seat is required',
            }).refine(async (val) => !!(await (0, seat_service_1.existsBySeatId)(val)), {
                message: 'Seat type not exist',
            }),
            amount: (0, zod_1.number)({
                required_error: 'Amount of seat is required',
            }).min(1, 'Seat amount must greater than 0'),
        })
            .array()
            .min(1)
            .refine((val) => val.length === lodash_1.default.uniqBy(val, 'type').length, {
            message: 'Exist duplicate seat type',
        }),
    })
        .refine(({ departureTime, arrivalTime }) => departureTime < arrivalTime, {
        message: 'Departure time must before Arrival time',
        path: ['departureTime'],
    })
        .refine(({ fromLocation, toLocation }) => fromLocation !== toLocation, {
        message: 'toLocation must diffirent fromLocation',
        path: ['toLocation'],
    })
        .refine(({ fromLocation, toLocation, stopovers }) => {
        const index = stopovers.findIndex(({ airport }) => airport === fromLocation || airport === toLocation);
        return index === -1;
    }, { message: 'Exists Stopover identical with fromLocation or toLocation', path: ['stopovers'] }),
});
exports.updateFlightSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        flightId,
    }),
    body: exports.createFlightSchema.shape.body,
});
exports.getFlightsSchema = (0, zod_1.object)({
    query: (0, zod_1.object)({
        departureDate: (0, zod_1.string)()
            .refine((val) => Date.parse(val), { message: 'Invalid Date' })
            .optional(),
        fromLocation: (0, zod_1.string)()
            .refine(async (val) => !!(await (0, airport_service_1.existsByAirportId)(val)), {
            message: 'Airport location not found',
        })
            .optional(),
        toLocation: (0, zod_1.string)()
            .refine(async (val) => !!(await (0, airport_service_1.existsByAirportId)(val)), {
            message: 'Airport location not found',
        })
            .optional(),
    }),
});
exports.addFlightTicketSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        flightId,
    }),
    body: (0, zod_1.array)((0, zod_1.object)({
        seatClassId: (0, zod_1.string)({
            required_error: 'Type of seat is required',
        }),
        amount: (0, zod_1.number)({
            required_error: 'Amount of tickets is required',
        }).nonnegative(),
    }))
        .min(1)
        .refine((val) => val.length === lodash_1.default.uniqBy(val, 'seatClassId').length, {
        message: 'Exist duplicate seat class',
    }),
});
exports.getFlightShema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        flightId,
    }),
});
exports.updateTicketsToPaidSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        userId: (0, zod_1.string)({
            required_error: 'User Id is required',
        }),
        flightId,
    }),
});
exports.createCheckoutSessionSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        flightId,
    }),
    body: (0, zod_1.object)({
        ticketIds: (0, zod_1.string)().array().nonempty(),
    }),
});
