"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countAirports = exports.findAllAirports = exports.updateAirport = exports.createAirport = exports.findAirportById = exports.existsByAirportNameAndExceptId = exports.existsByAirportName = exports.existsByAirportId = void 0;
const airport_model_1 = __importDefault(require("@/model/airport.model"));
async function existsByAirportId(id) {
    try {
        const isExists = await airport_model_1.default.exists({ _id: id });
        return isExists;
    }
    catch (err) {
        return null;
    }
}
exports.existsByAirportId = existsByAirportId;
async function existsByAirportName(name) {
    try {
        const isExists = await airport_model_1.default.exists({ name: name });
        return isExists;
    }
    catch (err) {
        return null;
    }
}
exports.existsByAirportName = existsByAirportName;
async function existsByAirportNameAndExceptId(name, id) {
    try {
        const isExists = await airport_model_1.default.findOne({ _id: { $nin: [id] }, name: name });
        return isExists === null || isExists === void 0 ? void 0 : isExists._id;
    }
    catch (err) {
        return null;
    }
}
exports.existsByAirportNameAndExceptId = existsByAirportNameAndExceptId;
async function findAirportById(id) {
    return airport_model_1.default.findById(id);
}
exports.findAirportById = findAirportById;
async function createAirport(airport) {
    return airport_model_1.default.create(airport);
}
exports.createAirport = createAirport;
async function updateAirport(id, airport) {
    return airport_model_1.default.findByIdAndUpdate(id, airport);
}
exports.updateAirport = updateAirport;
async function findAllAirports() {
    return airport_model_1.default.find({});
}
exports.findAllAirports = findAllAirports;
async function countAirports() {
    return airport_model_1.default.countDocuments();
}
exports.countAirports = countAirports;
