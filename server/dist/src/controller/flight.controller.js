"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketsOrderedToPaidHandler = exports.getFlightsOrderedHandler = exports.createCheckoutSessionHandler = exports.addTicketsFlightHandler = exports.updateFlightHandler = exports.createFlightHandler = exports.getFlightHandler = exports.getFlightsHandler = void 0;
const flight_model_1 = require("@/model/flight.model");
const nanoid_1 = require("nanoid");
const config_service_1 = require("@/service/config.service");
const flight_service_1 = require("@/service/flight.service");
const seat_service_1 = require("@/service/seat.service");
const typegoose_1 = require("@typegoose/typegoose");
const dayjs_1 = __importDefault(require("dayjs"));
const duration_1 = __importDefault(require("dayjs/plugin/duration"));
const zod_1 = require("zod");
const airport_service_1 = require("@/service/airport.service");
const lodash_1 = __importDefault(require("lodash"));
const user_service_1 = require("@/service/user.service");
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("config"));
const jwt_1 = require("@/utils/jwt");
dayjs_1.default.extend(duration_1.default);
const nanoid = (0, nanoid_1.customAlphabet)('1234567890ABCDEFGHZXS', 8);
const stripe = new stripe_1.default(config_1.default.get('stripeSecretKey'), {
    apiVersion: '2020-08-27',
});
async function getFlightsHandler(req, res) {
    var _a;
    try {
        const { departureDate, fromLocation, toLocation } = req.query;
        const flights = await (0, flight_service_1.getFlightsWithFilter)({
            ...(departureDate && {
                departureTime: {
                    $gte: (0, dayjs_1.default)(departureDate).startOf('day'),
                    $lte: (0, dayjs_1.default)(departureDate).endOf('day'),
                },
            }),
            ...(fromLocation && { fromLocation: fromLocation }),
            ...(toLocation && { toLocation: toLocation }),
        });
        if (!((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            return res.send(flights.map((flight) => lodash_1.default.omit(flight.toObject(), ['tickets'])));
        }
        res.send(flights);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.getFlightsHandler = getFlightsHandler;
async function getFlightHandler(req, res) {
    var _a;
    try {
        const { flightId } = req.params;
        const flight = await (0, flight_service_1.getFlightById)(flightId);
        if (!flight)
            throw new Error('Flight not found');
        if (!((_a = res.locals.user) === null || _a === void 0 ? void 0 : _a.isAdmin)) {
            return res.send(lodash_1.default.omit(flight.toJSON(), ['tickets']));
        }
        res.send(flight);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
exports.getFlightHandler = getFlightHandler;
async function createFlightHandler(req, res) {
    try {
        const config = await (0, config_service_1.getConfigrugationValue)();
        if (!config)
            throw new Error('Configuration environment variable not found');
        const validateErrors = [];
        // Check Flight Duration is valid ?
        const flightDuration = (0, dayjs_1.default)(req.body.arrivalTime).diff(req.body.departureTime, 's');
        if (flightDuration < config.flightTimeMin) {
            validateErrors.push({
                message: 'Flight Duration is too small',
                path: ['arrivalTime'],
            });
        }
        // Check Stopover delay is valid ?
        req.body.stopovers.forEach(({ delay }, i) => {
            if (delay < config.timeDelayMin) {
                validateErrors.push({
                    message: 'Time delay is too short',
                    path: ['stopovers', i, 'delay'],
                });
            }
            else if (delay > config.timeDelayMax) {
                validateErrors.push({
                    message: 'Time delay is too long',
                    path: ['stopovers', i, 'delay'],
                });
            }
        });
        const fromLocation = (await (0, airport_service_1.findAirportById)(req.body.fromLocation));
        const toLocation = (await (0, airport_service_1.findAirportById)(req.body.toLocation));
        const stopovers = await Promise.all(req.body.stopovers.map(async (stopover) => {
            const airport = await (0, airport_service_1.findAirportById)(stopover.airport);
            return {
                ...stopover,
                airport: airport,
            };
        }));
        const seats = await Promise.all(req.body.seats.map(async (seat) => {
            const seatClass = await (0, seat_service_1.getSeatClassById)(seat.type);
            return {
                ...seat,
                type: seatClass,
            };
        }));
        if (validateErrors.length)
            return res.status(400).send(validateErrors);
        const flight = await (0, flight_service_1.createFlight)({
            ...req.body,
            fromLocation,
            toLocation,
            stopovers,
            seats,
            timeForPaymentTicket: (0, dayjs_1.default)(req.body.departureTime)
                .subtract(config === null || config === void 0 ? void 0 : config.timeLimitCancelTicket, 'day')
                .startOf('day')
                .toDate(),
        });
        res.status(201).send(flight);
    }
    catch (err) {
        res.status(500).send({
            message: err.message,
        });
    }
}
exports.createFlightHandler = createFlightHandler;
async function updateFlightHandler(req, res) {
    try {
        const config = await (0, config_service_1.getConfigrugationValue)();
        if (!config)
            throw new Error('Configuration environment variable not found');
        const validateErrors = [];
        // Check Flight Duration is valid ?
        const flightDuration = (0, dayjs_1.default)(req.body.arrivalTime).diff(req.body.departureTime, 's'); // console.log(dayjs.duration(flightDuration * 1000).hours());
        if (flightDuration < config.flightTimeMin) {
            validateErrors.push({
                message: 'Flight Duration is too small',
                path: ['arrivalTime'],
            });
        }
        // Check Stopover delay is valid ?
        req.body.stopovers.forEach(({ delay }, i) => {
            if (delay < config.timeDelayMin) {
                validateErrors.push({
                    message: 'Time delay is too short',
                    path: ['stopovers', i, 'delay'],
                });
            }
            else if (delay > config.timeDelayMax) {
                validateErrors.push({
                    message: 'Time delay is too long',
                    path: ['stopovers', i, 'delay'],
                });
            }
        });
        const fromLocation = (await (0, airport_service_1.findAirportById)(req.body.fromLocation));
        const toLocation = (await (0, airport_service_1.findAirportById)(req.body.toLocation));
        const stopovers = await Promise.all(req.body.stopovers.map(async (stopover) => {
            const airport = await (0, airport_service_1.findAirportById)(stopover.airport);
            return {
                ...stopover,
                airport: airport,
            };
        }));
        const seats = await Promise.all(req.body.seats.map(async (seat) => {
            const seatClass = await (0, seat_service_1.getSeatClassById)(seat.type);
            return {
                ...seat,
                type: seatClass,
            };
        }));
        if (validateErrors.length)
            return res.status(400).send(validateErrors);
        const { flightId } = req.params;
        await (0, flight_service_1.updateFlightById)(flightId, {
            ...req.body,
            fromLocation,
            toLocation,
            stopovers,
            seats,
            timeForPaymentTicket: (0, dayjs_1.default)(req.body.departureTime)
                .subtract(config === null || config === void 0 ? void 0 : config.timeLimitCancelTicket, 'day')
                .startOf('day')
                .toDate(),
        });
        res.send('Flight successfully updated');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
exports.updateFlightHandler = updateFlightHandler;
async function addTicketsFlightHandler(req, res) {
    try {
        const { flightId } = req.params;
        const config = await (0, config_service_1.getConfigrugationValue)();
        if (!config)
            throw new Error('Configuration environment variable not found');
        const flight = await (0, flight_service_1.getFlightById)(flightId);
        if (!flight)
            throw new Error('Flight not found');
        if ((0, dayjs_1.default)(flight.departureTime).isBefore((0, dayjs_1.default)())) {
            return res.status(400).send([{ path: [], message: 'Flight in past' }]);
        }
        if ((0, dayjs_1.default)(flight.departureTime).subtract(config.timeLimitBuyTicket, 'day').isBefore((0, dayjs_1.default)(), 'day')) {
            return res.status(400).send([{ path: [], message: 'Now is expiration date for the order' }]);
        }
        const seatsOfFlight = flight.seats.map((seat) => {
            if (!(0, typegoose_1.isDocument)(seat.type)) {
                throw new Error('Type not doc');
            }
            seat.type;
            return {
                type: seat.type._id,
                extraFee: seat.type.extraFee,
                amount: seat.amount,
            };
        });
        const ticketsOfFlight = flight.tickets.map((ticket) => {
            if (!(0, typegoose_1.isDocument)(ticket.seatClass)) {
                throw new Error('seatClass not doc');
            }
            return {
                seatClass: ticket.seatClass._id,
                isValid: ticket.isValid,
            };
        });
        const validateErrors = new zod_1.ZodError([]);
        req.body.forEach(({ seatClassId: ticketSeatClassId, amount: ticketsAmount }, i) => {
            const seatOfFlight = seatsOfFlight[seatsOfFlight.findIndex((seat) => seat.type.toString() === ticketSeatClassId)];
            if (!seatOfFlight) {
                validateErrors.addIssue({
                    code: 'custom',
                    message: 'Seat Class is not exist in Flight',
                    path: ['body', i, 'seatClassId'],
                });
            }
            else {
                const seatsOrderedAmount = ticketsOfFlight.filter(({ seatClass, isValid }) => {
                    return seatClass.toString() === ticketSeatClassId && isValid;
                }).length;
                if (seatsOrderedAmount + ticketsAmount > seatOfFlight.amount) {
                    validateErrors.addIssue({
                        code: 'custom',
                        message: 'Remaining seats not enought',
                        path: ['body', i, 'amount'],
                    });
                }
            }
        });
        if (!validateErrors.isEmpty)
            return res.status(400).send(validateErrors.issues);
        const tickets = [];
        req.body.map(async ({ seatClassId, amount }) => {
            const seatOfFlight = seatsOfFlight[seatsOfFlight.findIndex((seat) => seat.type.toString() === seatClassId)];
            for (let i = 0; i < amount; i++) {
                const ticket = new flight_model_1.Ticket();
                ticket._id = nanoid();
                ticket.seatClass = seatOfFlight.type;
                ticket.user = res.locals.user._id;
                ticket.price = Math.round((flight.price * (100 + seatOfFlight.extraFee)) / 100 / 10000) * 10000;
                tickets.push(ticket);
            }
        });
        await (0, flight_service_1.addTicketsToFlight)(flightId, tickets);
        const ticketIds = tickets.map(({ _id }) => _id);
        res.status(201).send(ticketIds);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
exports.addTicketsFlightHandler = addTicketsFlightHandler;
async function createCheckoutSessionHandler(req, res) {
    const userId = res.locals.user._id;
    const flightId = req.params.flightId;
    const ticketIds = [...req.body.ticketIds];
    const flight = await (0, flight_service_1.getFlightById)(flightId);
    if (!flight) {
        return res.status(400).send([
            {
                path: ['params', 'flightId'],
                message: 'Flight not found with flightId: ' + flightId,
            },
        ]);
    }
    const tickets = [];
    ticketIds.forEach((ticketId, i) => {
        var _a;
        let errorMessage;
        const ticketIndex = (_a = flight.tickets) === null || _a === void 0 ? void 0 : _a.findIndex(({ _id }) => _id === ticketId);
        if (ticketIndex === -1)
            errorMessage = 'Ticket ID is not valid';
        const ticket = flight.tickets[ticketIndex];
        if (ticket.paid)
            errorMessage = 'Ticket is paid';
        if (!ticket.isValid)
            errorMessage = 'Ticket is canceled';
        if (errorMessage) {
            return res.status(400).send([
                {
                    path: ['body', 'ticketIds', i],
                    message: errorMessage,
                },
            ]);
        }
        if (!(0, typegoose_1.isDocument)(ticket.user)) {
            throw new Error('ticket.user not doc');
        }
        if (!(0, typegoose_1.isDocument)(ticket.seatClass)) {
            throw new Error('ticket.seatClass not doc');
        }
        const seatClass = ticket.seatClass;
        const price = ticket.price;
        if (ticket.user._id.toString() === userId) {
            const index = tickets.findIndex((i) => i.seatClass._id === seatClass._id);
            if (index === -1) {
                tickets.push({
                    seatClass,
                    price,
                    quantity: 1,
                });
            }
            else {
                tickets[index].quantity++;
            }
        }
    });
    const sessionExpiresSec = +config_1.default.get('stripeSessionExpiresTime');
    const session = await stripe.checkout.sessions.create({
        success_url: `${config_1.default.get('clientHost')}/user/ordered`,
        cancel_url: `${config_1.default.get('clientHost')}/user/ordered`,
        payment_method_types: ['card'],
        mode: 'payment',
        payment_intent_data: {
            metadata: {
                token: (0, jwt_1.signJwt)({
                    flightId,
                    ticketIds,
                }, 'accessTokenPrivateKey', {
                    expiresIn: sessionExpiresSec,
                }),
            },
        },
        customer_email: res.locals.user.email,
        line_items: tickets.map((ticket) => {
            var _a;
            return ({
                price_data: {
                    currency: 'VND',
                    product_data: {
                        name: (_a = ticket.seatClass) === null || _a === void 0 ? void 0 : _a.className,
                    },
                    unit_amount: ticket.price,
                },
                quantity: ticket.quantity,
            });
        }),
        expires_at: Math.floor(Date.now() / 1000) + sessionExpiresSec,
    });
    return res.status(200).send({ paymentUrl: session.url });
}
exports.createCheckoutSessionHandler = createCheckoutSessionHandler;
async function getFlightsOrderedHandler(req, res) {
    const userId = res.locals.user._id;
    const flights = await (0, flight_service_1.getFlightOrderedByUser)(userId);
    const result = flights.map((flight) => {
        var _a;
        const leanFlight = flight.toObject();
        return {
            ...leanFlight,
            tickets: (_a = leanFlight.tickets) === null || _a === void 0 ? void 0 : _a.map((ticket) => lodash_1.default.omit(ticket, ['user', '__v'])),
        };
    });
    res.send(result);
}
exports.getFlightsOrderedHandler = getFlightsOrderedHandler;
async function updateTicketsOrderedToPaidHandler(req, res) {
    try {
        const { flightId, userId } = req.params;
        const validateErrors = [];
        const flight = await (0, flight_service_1.getFlightById)(flightId);
        const user = await (0, user_service_1.findUserById)(userId);
        if (!flight) {
            validateErrors.push({
                path: ['params', 'flightId'],
            });
        }
        if (!user) {
            validateErrors.push({
                path: ['params', 'user'],
            });
        }
        if (validateErrors.length)
            return res.status(400).send(validateErrors);
        if (flight && user) {
            await (0, flight_service_1.updateTicketsOrderedToPaidByUserAndFlight)(user, flight);
        }
        res.send('Update tickets ordered to paid successfully!');
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}
exports.updateTicketsOrderedToPaidHandler = updateTicketsOrderedToPaidHandler;
