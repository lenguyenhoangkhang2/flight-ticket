"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigSchema = void 0;
const zod_1 = require("zod");
exports.updateConfigSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        airportAmountMax: (0, zod_1.number)().nonnegative(),
        seatClassAmountMax: (0, zod_1.number)().nonnegative(),
        flightTimeMin: (0, zod_1.number)().nonnegative(),
        numberStopoverMax: (0, zod_1.number)().nonnegative(),
        timeDelayMin: (0, zod_1.number)().nonnegative(),
        timeDelayMax: (0, zod_1.number)().nonnegative(),
        timeLimitBuyTicket: (0, zod_1.number)().nonnegative(),
        timeLimitCancelTicket: (0, zod_1.number)().nonnegative(),
    }),
});
