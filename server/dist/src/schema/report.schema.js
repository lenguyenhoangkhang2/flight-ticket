"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMonthReportSchama = exports.deleteYearReportSchama = exports.updateYearReportSchama = exports.updateMonthReportSchama = exports.createYearReportSchema = exports.createMonthReportSchema = void 0;
const zod_1 = require("zod");
const isSameOrAfter_1 = __importDefault(require("dayjs/plugin/isSameOrAfter"));
const dayjs_1 = __importDefault(require("dayjs"));
dayjs_1.default.extend(isSameOrAfter_1.default);
exports.createMonthReportSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        time: (0, zod_1.string)({
            required_error: 'Time for create report required',
        })
            .min(1, { message: 'Time for create report required' })
            .refine((value) => Date.parse(value), {
            message: "Can't parse to date",
        })
            .transform((value) => new Date(value))
            .refine((value) => (0, dayjs_1.default)().isSameOrAfter(value, 'month'), {
            message: 'Invalid date time to create month report',
        }),
    }),
});
exports.createYearReportSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        time: (0, zod_1.string)({
            required_error: 'Time for create report required',
        })
            .min(1, { message: 'Time for create report required' })
            .refine((value) => Date.parse(value), {
            message: "Can't parse to date",
        })
            .transform((value) => new Date(value))
            .refine((value) => (0, dayjs_1.default)().isSameOrAfter(value, 'year'), {
            message: 'Invalid date time to create year report',
        }),
    }),
});
exports.updateMonthReportSchama = (0, zod_1.object)({
    params: (0, zod_1.object)({
        reportId: (0, zod_1.string)(),
    }),
});
exports.updateYearReportSchama = exports.updateMonthReportSchama;
exports.deleteYearReportSchama = exports.updateMonthReportSchama;
exports.deleteMonthReportSchama = exports.updateMonthReportSchama;
