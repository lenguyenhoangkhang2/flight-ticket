"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMonthReport = exports.deleteYearReport = exports.updateYearReport = exports.updateMonthReport = exports.isExistYearReport = exports.isExistMonthReport = exports.createMonthReport = exports.createYearReport = void 0;
const flight_model_1 = __importDefault(require("@/model/flight.model"));
const report_model_1 = require("@/model/report.model");
const dayjs_1 = __importDefault(require("dayjs"));
const fp_1 = __importDefault(require("lodash/fp"));
async function getLastestMonthReportItems(time) {
    const month = (0, dayjs_1.default)(time).month() + 1;
    const year = (0, dayjs_1.default)(time).year();
    const monthReportItems = await flight_model_1.default.aggregate()
        .match({
        $expr: {
            $and: [
                {
                    $eq: [{ $month: '$departureTime' }, month],
                },
                {
                    $eq: [{ $year: '$departureTime' }, year],
                },
            ],
        },
    })
        .unwind('$tickets')
        .match({
        'tickets.paid': true,
    })
        .group({
        _id: {
            flightId: '$_id',
        },
        ticketSelledAmount: { $sum: 1 },
        revenue: { $sum: '$tickets.price' },
    })
        .project({
        _id: 0,
        flightId: '$_id.flightId',
        ticketSelledAmount: '$ticketSelledAmount',
        revenue: '$revenue',
    })
        .sort({
        revenue: -1,
    });
    const totalRevenue = monthReportItems.reduce((total, item) => total + item.revenue, 0);
    return monthReportItems.map((item) => {
        item.rate = item.revenue / totalRevenue;
        return item;
    });
}
async function getLastestYearReportItems(time) {
    const year = (0, dayjs_1.default)(time).year();
    const yearReportItems = await flight_model_1.default.aggregate()
        .match({
        $expr: {
            $and: [
                {
                    $eq: [{ $year: '$departureTime' }, year],
                },
            ],
        },
    })
        .addFields({
        revenue: {
            $reduce: {
                input: '$tickets',
                initialValue: 0,
                in: {
                    $add: [
                        '$$value',
                        {
                            $cond: [{ $eq: ['$$this.paid', true] }, '$$this.price', 0],
                        },
                    ],
                },
            },
        },
    })
        .group({
        _id: {
            $month: '$departureTime',
        },
        revenue: { $sum: '$revenue' },
        flightAmount: { $sum: 1 },
    })
        .project({
        _id: 0,
        month: '$_id',
        revenue: '$revenue',
        flightAmount: '$flightAmount',
    });
    let totalRevenue = 0;
    for (let i = 1; i <= 12; i++) {
        const idx = yearReportItems.findIndex((item) => item.month === i);
        if (idx === -1) {
            yearReportItems.push({
                month: i,
                revenue: 0,
                flightAmount: 0,
            });
        }
        else {
            totalRevenue += yearReportItems[idx].revenue;
        }
    }
    return yearReportItems
        .map((item) => fp_1.default.set('rate', item.revenue / totalRevenue, item))
        .sort((a, b) => a.month - b.month);
}
async function createYearReport(time) {
    const items = await getLastestYearReportItems(time);
    return report_model_1.YearReportModel.create({
        time,
        items,
    });
}
exports.createYearReport = createYearReport;
async function createMonthReport(time) {
    const items = await getLastestMonthReportItems(time);
    return report_model_1.MonthReportModel.create({
        time,
        items,
    });
}
exports.createMonthReport = createMonthReport;
async function isExistMonthReport(time) {
    const month = (0, dayjs_1.default)(time).month() + 1;
    const year = (0, dayjs_1.default)(time).year();
    return report_model_1.MonthReportModel.exists({
        $expr: {
            $and: [
                {
                    $eq: [{ $month: '$time' }, month],
                },
                {
                    $eq: [{ $year: '$time' }, year],
                },
            ],
        },
    });
}
exports.isExistMonthReport = isExistMonthReport;
async function isExistYearReport(time) {
    const year = (0, dayjs_1.default)(time).year();
    return report_model_1.YearReportModel.exists({
        $eq: [{ $year: '$time' }, year],
    });
}
exports.isExistYearReport = isExistYearReport;
async function updateMonthReport(reportId) {
    const report = await report_model_1.MonthReportModel.findById(reportId).orFail();
    report.items = await getLastestMonthReportItems(report.time);
    return report.save();
}
exports.updateMonthReport = updateMonthReport;
async function updateYearReport(reportId) {
    const report = await report_model_1.YearReportModel.findById(reportId).orFail();
    report.items = await getLastestYearReportItems(report.time);
    return report.save();
}
exports.updateYearReport = updateYearReport;
async function deleteYearReport(reportId) {
    return report_model_1.YearReportModel.findByIdAndDelete(reportId);
}
exports.deleteYearReport = deleteYearReport;
async function deleteMonthReport(reportId) {
    return report_model_1.MonthReportModel.findByIdAndDelete(reportId);
}
exports.deleteMonthReport = deleteMonthReport;
