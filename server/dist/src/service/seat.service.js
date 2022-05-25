"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeatClassById = exports.countSeats = exports.getAllSeats = exports.updateSeat = exports.createSeat = exports.existsBySeatClassnameAndExceptId = exports.existsBySeatClassname = exports.existsBySeatId = void 0;
const seat_model_1 = __importDefault(require("@/model/seat.model"));
async function existsBySeatId(id) {
    try {
        const isExists = await seat_model_1.default.exists({ _id: id });
        return isExists;
    }
    catch (err) {
        return null;
    }
}
exports.existsBySeatId = existsBySeatId;
async function existsBySeatClassname(name) {
    try {
        const isExists = await seat_model_1.default.findOne({ className: name });
        return isExists;
    }
    catch (err) {
        return null;
    }
}
exports.existsBySeatClassname = existsBySeatClassname;
async function existsBySeatClassnameAndExceptId(name, id) {
    try {
        const isExists = await seat_model_1.default.findOne({ _id: { $nin: [id] }, className: name });
        return !!isExists;
    }
    catch (err) {
        return false;
    }
}
exports.existsBySeatClassnameAndExceptId = existsBySeatClassnameAndExceptId;
async function createSeat(seat) {
    return seat_model_1.default.create(seat);
}
exports.createSeat = createSeat;
async function updateSeat(id, seat) {
    return seat_model_1.default.findByIdAndUpdate(id, seat);
}
exports.updateSeat = updateSeat;
async function getAllSeats() {
    return seat_model_1.default.find({});
}
exports.getAllSeats = getAllSeats;
async function countSeats() {
    return seat_model_1.default.countDocuments();
}
exports.countSeats = countSeats;
async function getSeatClassById(seatClassId) {
    return seat_model_1.default.findById(seatClassId);
}
exports.getSeatClassById = getSeatClassById;
