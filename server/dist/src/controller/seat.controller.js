"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatsHandler = exports.updateSeatHandler = exports.createSeatHandler = void 0;
const config_service_1 = require("@/service/config.service");
const seat_service_1 = require("@/service/seat.service");
async function createSeatHandler(req, res) {
    try {
        const config = await (0, config_service_1.getConfigrugationValue)();
        const seatsAmount = await (0, seat_service_1.countSeats)();
        if (!config)
            throw new Error('Configuration environment variable not found');
        if (seatsAmount >= config.seatClassAmountMax)
            return res.status(400).send({
                message: `Amount of SeatClass has reached the limit`,
            });
        const seat = await (0, seat_service_1.createSeat)(req.body);
        res.send(seat);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.createSeatHandler = createSeatHandler;
async function updateSeatHandler(req, res) {
    try {
        const { seatId } = req.params;
        const { className, extraFee } = req.body;
        const exists = await (0, seat_service_1.existsBySeatClassnameAndExceptId)(className, seatId);
        if (exists) {
            return res.status(400).send([
                {
                    message: 'Class name is exists',
                    path: ['body', 'className'],
                },
            ]);
        }
        await (0, seat_service_1.updateSeat)(seatId, {
            className,
            extraFee,
        });
        res.send('Seat class successfully updated');
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.updateSeatHandler = updateSeatHandler;
async function getSeatsHandler(_req, res) {
    try {
        const seats = await (0, seat_service_1.getAllSeats)();
        res.send(seats);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.getSeatsHandler = getSeatsHandler;
