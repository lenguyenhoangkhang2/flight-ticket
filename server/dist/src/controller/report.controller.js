"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteYearReportHandle = exports.deleteMonthReportHandle = exports.updateYearReportHandler = exports.updateMonthReportHandler = exports.getYearReportHandler = exports.getMonthReportHandler = exports.createYearReportHandler = exports.createMonthReportHandler = void 0;
const report_model_1 = require("@/model/report.model");
const report_service_1 = require("@/service/report.service");
const dayjs_1 = __importDefault(require("dayjs"));
async function createMonthReportHandler(req, res) {
    const time = req.body.time;
    const isRpExist = await (0, report_service_1.isExistMonthReport)(time);
    if (isRpExist) {
        return res.status(400).send([
            {
                path: ['body', 'time'],
                message: `Month report for ${(0, dayjs_1.default)(time).month() + 1}-${(0, dayjs_1.default)(time).year()} is exist`,
            },
        ]);
    }
    const report = await (0, report_service_1.createMonthReport)(time);
    res.send(report);
}
exports.createMonthReportHandler = createMonthReportHandler;
async function createYearReportHandler(req, res) {
    const time = req.body.time;
    const isRpExist = await (0, report_service_1.isExistYearReport)(time);
    if (isRpExist) {
        return res.status(400).send([
            {
                path: ['body', 'time'],
                message: `Year report for ${(0, dayjs_1.default)(time).year()} is exist`,
            },
        ]);
    }
    const report = await (0, report_service_1.createYearReport)(time);
    res.send(report);
}
exports.createYearReportHandler = createYearReportHandler;
async function getMonthReportHandler(req, res) {
    const reports = await report_model_1.MonthReportModel.find({});
    res.send(reports);
}
exports.getMonthReportHandler = getMonthReportHandler;
async function getYearReportHandler(req, res) {
    const reports = await report_model_1.YearReportModel.find({});
    res.send(reports);
}
exports.getYearReportHandler = getYearReportHandler;
async function updateMonthReportHandler(req, res) {
    const reportId = req.params.reportId;
    const report = await (0, report_service_1.updateMonthReport)(reportId);
    res.send(report);
}
exports.updateMonthReportHandler = updateMonthReportHandler;
async function updateYearReportHandler(req, res) {
    const reportId = req.params.reportId;
    const report = await (0, report_service_1.updateYearReport)(reportId);
    res.send(report);
}
exports.updateYearReportHandler = updateYearReportHandler;
async function deleteMonthReportHandle(req, res) {
    const reportId = req.params.reportId;
    await (0, report_service_1.deleteMonthReport)(reportId);
    res.sendStatus(200);
}
exports.deleteMonthReportHandle = deleteMonthReportHandle;
async function deleteYearReportHandle(req, res) {
    const reportId = req.params.reportId;
    await (0, report_service_1.deleteYearReport)(reportId);
    res.sendStatus(200);
}
exports.deleteYearReportHandle = deleteYearReportHandle;
