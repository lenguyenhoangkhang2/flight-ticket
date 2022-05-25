"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flight = exports.Stopover = exports.Ticket = exports.SeatsOfFlight = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const airport_model_1 = require("./airport.model");
const seat_model_1 = require("./seat.model");
const user_model_1 = require("./user.model");
let SeatsOfFlight = class SeatsOfFlight {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => seat_model_1.Seat }),
    __metadata("design:type", Object)
], SeatsOfFlight.prototype, "type", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], SeatsOfFlight.prototype, "amount", void 0);
SeatsOfFlight = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            _id: false,
        },
    })
], SeatsOfFlight);
exports.SeatsOfFlight = SeatsOfFlight;
let Ticket = class Ticket {
};
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Ticket.prototype, "_id", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => user_model_1.User }),
    __metadata("design:type", Object)
], Ticket.prototype, "user", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => seat_model_1.Seat }),
    __metadata("design:type", Object)
], Ticket.prototype, "seatClass", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], Ticket.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: false }),
    __metadata("design:type", Boolean)
], Ticket.prototype, "paid", void 0);
__decorate([
    (0, typegoose_1.prop)({ default: true }),
    __metadata("design:type", Boolean)
], Ticket.prototype, "isValid", void 0);
Ticket = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], Ticket);
exports.Ticket = Ticket;
let Stopover = class Stopover {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => airport_model_1.Airport }),
    __metadata("design:type", Object)
], Stopover.prototype, "airport", void 0);
__decorate([
    (0, typegoose_1.prop)({ min: 0, required: true }),
    __metadata("design:type", Number)
], Stopover.prototype, "delay", void 0);
__decorate([
    (0, typegoose_1.prop)(),
    __metadata("design:type", String)
], Stopover.prototype, "note", void 0);
Stopover = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            _id: false,
        },
    })
], Stopover);
exports.Stopover = Stopover;
let Flight = class Flight {
};
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", String)
], Flight.prototype, "airline", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => airport_model_1.Airport }),
    __metadata("design:type", Object)
], Flight.prototype, "fromLocation", void 0);
__decorate([
    (0, typegoose_1.prop)({ ref: () => airport_model_1.Airport }),
    __metadata("design:type", Object)
], Flight.prototype, "toLocation", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Stopover], default: [] }),
    __metadata("design:type", Array)
], Flight.prototype, "stopovers", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: () => Date }),
    __metadata("design:type", Date)
], Flight.prototype, "departureTime", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Date)
], Flight.prototype, "arrivalTime", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Flight.prototype, "price", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: () => [SeatsOfFlight] }),
    __metadata("design:type", Array)
], Flight.prototype, "seats", void 0);
__decorate([
    (0, typegoose_1.prop)({ type: () => [Ticket], default: [] }),
    __metadata("design:type", Array)
], Flight.prototype, "tickets", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, type: () => Date }),
    __metadata("design:type", Date)
], Flight.prototype, "timeForPaymentTicket", void 0);
Flight = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], Flight);
exports.Flight = Flight;
const FlightModel = (0, typegoose_1.getModelForClass)(Flight);
exports.default = FlightModel;
