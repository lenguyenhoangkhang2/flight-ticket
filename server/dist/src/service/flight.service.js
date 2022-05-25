"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelExpiredTickets = exports.updateTicketsOrderedToPaidByUserAndFlight = exports.getFlightOrderedByUser = exports.getFlightById = exports.addTicketsToFlight = exports.getFlightsWithFilter = exports.updateFlightById = exports.existsFlightById = exports.addTicketFlight = exports.createFlight = void 0;
const flight_model_1 = __importDefault(require("@/model/flight.model"));
const typegoose_1 = require("@typegoose/typegoose");
const config_service_1 = require("./config.service");
const logger_1 = __importDefault(require("@/utils/logger"));
async function createFlight(flight) {
    return flight_model_1.default.create(flight);
}
exports.createFlight = createFlight;
async function addTicketFlight(flightId, ticket) {
    console.log(flightId, ticket);
}
exports.addTicketFlight = addTicketFlight;
async function existsFlightById(flightId) {
    try {
        return await flight_model_1.default.exists({ _id: flightId });
    }
    catch (err) {
        return null;
    }
}
exports.existsFlightById = existsFlightById;
async function updateFlightById(flightId, flight) {
    return flight_model_1.default.findByIdAndUpdate(flightId, flight);
}
exports.updateFlightById = updateFlightById;
async function getFlightsWithFilter(query) {
    return flight_model_1.default.find(query)
        .populate({ path: 'fromLocation', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'toLocation', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'stopovers.airport', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'tickets.seatClass', select: '-__v -createdAt -updatedAt' })
        .populate({
        path: 'tickets.user',
        select: '-password -verified -isAdmin -verificationCode -__v -createdAt -updatedAt',
    })
        .populate({ path: 'seats.type', select: '-__v -createdAt -updatedAt' })
        .select('-__v');
}
exports.getFlightsWithFilter = getFlightsWithFilter;
async function addTicketsToFlight(flightId, addedTickets) {
    return flight_model_1.default.findByIdAndUpdate(flightId, { $push: { tickets: { $each: addedTickets } } });
}
exports.addTicketsToFlight = addTicketsToFlight;
async function getFlightById(flightId) {
    return flight_model_1.default.findById(flightId)
        .populate({ path: 'fromLocation', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'toLocation', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'stopovers.airport', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'tickets.seatClass', select: '-__v' })
        .populate({
        path: 'tickets.user',
        select: '-password -verified -isAdmin -verificationCode -__v -createdAt -updatedAt',
    })
        .populate({ path: 'seats.type', select: '-__v -createdAt -updatedAt' })
        .select('-__v');
}
exports.getFlightById = getFlightById;
async function getFlightOrderedByUser(userId) {
    const flights = await flight_model_1.default.find({
        tickets: {
            $elemMatch: { user: userId },
        },
    })
        .populate({ path: 'fromLocation', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'toLocation', select: '-__v -createdAt -updatedAt' })
        .populate({ path: 'stopovers.airport', select: '-__v -createdAt -updatedAt' })
        .populate('tickets.user')
        .populate({ path: 'tickets.seatClass', select: '-__v' })
        .select('-__v');
    const results = flights.map((flight) => {
        var _a;
        flight.tickets = (_a = flight.tickets) === null || _a === void 0 ? void 0 : _a.filter((ticket) => {
            if (!(0, typegoose_1.isDocument)(ticket.user)) {
                throw new Error('tickets.user not doc');
            }
            return ticket.user._id.toString() === userId;
        });
        return flight;
    });
    return results;
}
exports.getFlightOrderedByUser = getFlightOrderedByUser;
async function updateTicketsOrderedToPaidByUserAndFlight(user, flight) {
    var _a;
    flight.tickets = (_a = flight.tickets) === null || _a === void 0 ? void 0 : _a.map((ticket) => {
        if (!(0, typegoose_1.isDocument)(ticket.user)) {
            throw new Error('tickets.user not doc');
        }
        if (user.equals(ticket.user)) {
            ticket.paid = true;
        }
        return ticket;
    });
    await flight.save();
}
exports.updateTicketsOrderedToPaidByUserAndFlight = updateTicketsOrderedToPaidByUserAndFlight;
async function cancelExpiredTickets() {
    logger_1.default.info('Cancel Expired Tickets');
    const config = await (0, config_service_1.getConfigrugationValue)();
    if (!config)
        throw new Error('Configuration environment variable not found');
    const flights = await flight_model_1.default.find({
        timeForPaymentTicket: {
            $lte: new Date(),
        },
    });
    if (!flights.length)
        return;
    return Promise.all(flights.map((flight) => {
        var _a;
        flight.tickets = (_a = flight.tickets) === null || _a === void 0 ? void 0 : _a.map((ticket) => {
            if (!ticket.paid) {
                ticket.isValid = false;
            }
            return ticket;
        });
        return flight.save();
    }));
}
exports.cancelExpiredTickets = cancelExpiredTickets;
