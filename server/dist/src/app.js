"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('module-alias/register');
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const connectToDb_1 = __importDefault(require("@/utils/connectToDb"));
const logger_1 = __importDefault(require("@/utils/logger"));
const index_1 = __importDefault(require("@/routes/index"));
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const initialAdmin_1 = __importDefault(require("./utils/initialAdmin"));
const initialConfig_1 = __importDefault(require("./utils/initialConfig"));
const cron = __importStar(require("node-cron"));
const flight_service_1 = require("./service/flight.service");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const webhook_controller_1 = require("./controller/webhook.controller");
const app = (0, express_1.default)();
app.post('/stripe/webhook', express_1.default.raw({ type: 'application/json' }), webhook_controller_1.stripeWebHookHandler);
app.use((0, cors_1.default)({
    credentials: true,
    origin: [config_1.default.get('clientHost')],
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(deserializeUser_1.default);
app.use(index_1.default);
app.use((err, _req, res, _next) => {
    res.status(500).send({
        message: err.message,
    });
});
const port = config_1.default.get('port');
app.listen(port, async () => {
    logger_1.default.info(`App started at http://localhost:${port}`);
    await (0, connectToDb_1.default)();
    await (0, initialAdmin_1.default)();
    await (0, initialConfig_1.default)();
    await (0, flight_service_1.cancelExpiredTickets)();
    cron.schedule('* * * * *', async () => {
        await (0, flight_service_1.cancelExpiredTickets)();
    });
});
