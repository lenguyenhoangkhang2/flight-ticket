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
exports.YearReportModel = exports.MonthReportModel = exports.ReportModel = exports.YearReportItem = exports.MonthReportItem = exports.Report = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const flight_model_1 = require("./flight.model");
let Report = class Report {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, type: () => Date }),
    __metadata("design:type", Date)
], Report.prototype, "time", void 0);
Report = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            timestamps: true,
        },
    })
], Report);
exports.Report = Report;
let MonthReportItem = class MonthReportItem {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, ref: () => flight_model_1.Flight }),
    __metadata("design:type", Object)
], MonthReportItem.prototype, "flightId", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], MonthReportItem.prototype, "ticketSelledAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], MonthReportItem.prototype, "revenue", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], MonthReportItem.prototype, "rate", void 0);
MonthReportItem = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            _id: false,
        },
    })
], MonthReportItem);
exports.MonthReportItem = MonthReportItem;
let YearReportItem = class YearReportItem {
};
__decorate([
    (0, typegoose_1.prop)({ required: true, min: 1, max: 12 }),
    __metadata("design:type", Number)
], YearReportItem.prototype, "month", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], YearReportItem.prototype, "flightAmount", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], YearReportItem.prototype, "revenue", void 0);
__decorate([
    (0, typegoose_1.prop)({ required: true }),
    __metadata("design:type", Number)
], YearReportItem.prototype, "rate", void 0);
YearReportItem = __decorate([
    (0, typegoose_1.modelOptions)({
        schemaOptions: {
            _id: false,
        },
    })
], YearReportItem);
exports.YearReportItem = YearReportItem;
class MonthReport extends Report {
}
__decorate([
    (0, typegoose_1.prop)({ type: () => [MonthReportItem], required: true, default: [] }),
    __metadata("design:type", Array)
], MonthReport.prototype, "items", void 0);
class YearReport extends Report {
}
__decorate([
    (0, typegoose_1.prop)({ type: () => [YearReportItem], required: true, default: [] }),
    __metadata("design:type", Array)
], YearReport.prototype, "items", void 0);
exports.ReportModel = (0, typegoose_1.getModelForClass)(Report);
exports.MonthReportModel = (0, typegoose_1.getDiscriminatorModelForClass)(exports.ReportModel, MonthReport);
exports.YearReportModel = (0, typegoose_1.getDiscriminatorModelForClass)(exports.ReportModel, YearReport);
