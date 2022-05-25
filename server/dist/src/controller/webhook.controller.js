"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebHookHandler = void 0;
const config_1 = __importDefault(require("config"));
const stripe_1 = __importDefault(require("stripe"));
const logger_1 = __importDefault(require("@/utils/logger"));
const jwt_1 = require("@/utils/jwt");
const flight_service_1 = require("@/service/flight.service");
const stripe = new stripe_1.default(config_1.default.get('stripeSecretKey'), {
    apiVersion: '2020-08-27',
});
async function stripeWebHookHandler(req, res) {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];
    const endPointSecret = config_1.default.get('stripeEndpointSecret');
    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sig, endPointSecret);
    }
    catch (err) {
        logger_1.default.error(err.message);
        return res.status(400).json({ message: err.message });
    }
    const data = event.data;
    const eventType = event.type;
    switch (eventType) {
        case 'payment_intent.succeeded':
            const pi = data.object;
            const { token } = pi.metadata;
            const decoded = (0, jwt_1.verifyJwt)(token, 'accessTokenPublicKey');
            if (!decoded)
                return;
            const { flightId, ticketIds } = decoded;
            const flight = await (0, flight_service_1.getFlightById)(flightId);
            if (!flight)
                return;
            flight.tickets = flight.tickets.map((ticket) => {
                if (ticketIds.includes(ticket._id)) {
                    ticket.paid = true;
                }
                return ticket;
            });
            await flight.save();
        default:
            break;
    }
    return res.send({ seccess: true });
}
exports.stripeWebHookHandler = stripeWebHookHandler;
