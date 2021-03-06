"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const report_controller_1 = require("@/controller/report.controller");
const requireAdmin_1 = __importDefault(require("@/middleware/requireAdmin"));
const validateResourse_1 = __importDefault(require("@/middleware/validateResourse"));
const report_schema_1 = require("@/schema/report.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/api/reports/month', requireAdmin_1.default, (0, validateResourse_1.default)(report_schema_1.createMonthReportSchema), report_controller_1.createMonthReportHandler);
router.post('/api/reports/year', requireAdmin_1.default, (0, validateResourse_1.default)(report_schema_1.createYearReportSchema), report_controller_1.createYearReportHandler);
router.get('/api/reports/month', requireAdmin_1.default, report_controller_1.getMonthReportHandler);
router.get('/api/reports/year', requireAdmin_1.default, report_controller_1.getYearReportHandler);
router.put('/api/reports/month/:reportId', requireAdmin_1.default, (0, validateResourse_1.default)(report_schema_1.updateMonthReportSchama), report_controller_1.updateMonthReportHandler);
router.put('/api/reports/year/:reportId', requireAdmin_1.default, (0, validateResourse_1.default)(report_schema_1.updateYearReportSchama), report_controller_1.updateYearReportHandler);
router.delete('/api/reports/month/:reportId', requireAdmin_1.default, (0, validateResourse_1.default)(report_schema_1.deleteMonthReportSchama), report_controller_1.deleteMonthReportHandle);
router.delete('/api/reports/year/:reportId', requireAdmin_1.default, (0, validateResourse_1.default)(report_schema_1.deleteYearReportSchama), report_controller_1.deleteYearReportHandle);
exports.default = router;
