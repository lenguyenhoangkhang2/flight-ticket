"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flight_controller_1 = require("@/controller/flight.controller");
const requireAdmin_1 = __importDefault(require("@/middleware/requireAdmin"));
const requireUser_1 = __importDefault(require("@/middleware/requireUser"));
const validateResourse_1 = __importDefault(require("@/middleware/validateResourse"));
const flight_schema_1 = require("@/schema/flight.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/api/flights', requireAdmin_1.default, (0, validateResourse_1.default)(flight_schema_1.createFlightSchema), flight_controller_1.createFlightHandler);
router.put('/api/flights/:flightId', requireAdmin_1.default, (0, validateResourse_1.default)(flight_schema_1.updateFlightSchema), flight_controller_1.updateFlightHandler);
router.get('/api/flights', (0, validateResourse_1.default)(flight_schema_1.getFlightsSchema), flight_controller_1.getFlightsHandler);
router.get('/api/flights/:flightId', (0, validateResourse_1.default)(flight_schema_1.getFlightShema), flight_controller_1.getFlightHandler);
router.post('/api/flights/:flightId/tickets', requireUser_1.default, (0, validateResourse_1.default)(flight_schema_1.addFlightTicketSchema), flight_controller_1.addTicketsFlightHandler);
router.get('/api/flights/ordered/me', requireUser_1.default, flight_controller_1.getFlightsOrderedHandler);
router.put('/api/flights/:flightId/tickets/paid/:userId', requireAdmin_1.default, flight_controller_1.updateTicketsOrderedToPaidHandler);
router.post('/api/flights/:flightId/tickets/checkout-session', requireUser_1.default, (0, validateResourse_1.default)(flight_schema_1.createCheckoutSessionSchema), flight_controller_1.createCheckoutSessionHandler);
exports.default = router;