"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const seat_controller_1 = require("@/controller/seat.controller");
const requireAdmin_1 = __importDefault(require("@/middleware/requireAdmin"));
const validateResourse_1 = __importDefault(require("@/middleware/validateResourse"));
const seat_schema_1 = require("@/schema/seat.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/api/seats', requireAdmin_1.default, (0, validateResourse_1.default)(seat_schema_1.createSeatSchema), seat_controller_1.createSeatHandler);
router.put('/api/seats/:seatId', requireAdmin_1.default, (0, validateResourse_1.default)(seat_schema_1.updateSeatSchema), seat_controller_1.updateSeatHandler);
router.get('/api/seats', seat_controller_1.getSeatsHandler);
exports.default = router;
