"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAirportHandler = exports.createAirportHandler = exports.getAirportsHandler = void 0;
const airport_service_1 = require("@/service/airport.service");
const config_service_1 = require("@/service/config.service");
async function getAirportsHandler(req, res) {
    try {
        const airpots = await (0, airport_service_1.findAllAirports)();
        res.send(airpots);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.getAirportsHandler = getAirportsHandler;
async function createAirportHandler(req, res) {
    try {
        const config = await (0, config_service_1.getConfigrugationValue)();
        const airportsAmount = await (0, airport_service_1.countAirports)();
        if (!config)
            throw new Error('Configuration environment variable not found');
        if (airportsAmount >= config.airportAmountMax)
            return res.status(400).send({
                message: `Amount of airports has reached the limit`,
            });
        const airport = await (0, airport_service_1.createAirport)(req.body);
        res.send(airport);
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.createAirportHandler = createAirportHandler;
async function updateAirportHandler(req, res) {
    try {
        const { airportId } = req.params;
        const { name, location } = req.body;
        const exists = await (0, airport_service_1.existsByAirportNameAndExceptId)(name, airportId);
        if (exists) {
            return res.status(400).send({
                message: 'Name is exists',
                path: ['body', 'name'],
            });
        }
        await (0, airport_service_1.updateAirport)(airportId, {
            name,
            location,
        });
        res.send('Airport class successfully updated');
    }
    catch (err) {
        res.status(500).send(err);
    }
}
exports.updateAirportHandler = updateAirportHandler;
