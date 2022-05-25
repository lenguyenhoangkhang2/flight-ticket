"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAirportSchema = exports.createAirportSchema = void 0;
const airport_service_1 = require("@/service/airport.service");
const zod_1 = require("zod");
exports.createAirportSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: 'Name is required',
        }).refine(async (val) => !(await (0, airport_service_1.existsByAirportName)(val)), {
            message: 'Aiport name is exist',
        }),
        location: (0, zod_1.string)({
            required_error: 'Location is required',
        }).nonempty({
            message: 'Location is not empty',
        }),
    }),
});
exports.updateAirportSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        airportId: (0, zod_1.string)({
            required_error: 'Airport id is required',
        }).refine(async (val) => !!(await (0, airport_service_1.existsByAirportId)(val)), {
            message: 'Not found airport with Id',
        }),
    }),
    body: exports.createAirportSchema.shape.body.extend({
        name: (0, zod_1.string)({
            required_error: 'Name is required',
        }).min(1, {
            message: 'Name is not empty',
        }),
        location: (0, zod_1.string)({
            required_error: 'Location is required',
        }).min(1, {
            message: 'Location is not empty',
        }),
    }),
});
