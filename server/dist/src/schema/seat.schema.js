"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSeatSchema = exports.createSeatSchema = void 0;
const seat_service_1 = require("@/service/seat.service");
const zod_1 = require("zod");
exports.createSeatSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        className: (0, zod_1.string)({
            required_error: 'Class name is required',
        })
            .min(1, {
            message: 'Class name is required',
        })
            .refine(async (val) => !(await (0, seat_service_1.existsBySeatClassname)(val)), {
            message: 'Class name is exist',
        }),
        extraFee: (0, zod_1.number)({
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
exports.updateSeatSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        seatId: (0, zod_1.string)({
            required_error: 'Seat id is required',
        }).refine(async (val) => !!(await (0, seat_service_1.existsBySeatId)(val)), {
            message: 'Not found seat class with Id',
        }),
    }),
    body: exports.createSeatSchema.shape.body.extend({}),
});
