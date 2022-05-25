"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const airport_controller_1 = require("@/controller/airport.controller");
const requireAdmin_1 = __importDefault(require("@/middleware/requireAdmin"));
const validateResourse_1 = __importDefault(require("@/middleware/validateResourse"));
const airport_schema_1 = require("@/schema/airport.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/api/airports', requireAdmin_1.default, (0, validateResourse_1.default)(airport_schema_1.createAirportSchema), airport_controller_1.createAirportHandler);
router.put('/api/airports/:airportId', requireAdmin_1.default, (0, validateResourse_1.default)(airport_schema_1.updateAirportSchema), airport_controller_1.updateAirportHandler);
router.get('/api/airports', airport_controller_1.getAirportsHandler);
exports.default = router;
