"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("@/utils/logger"));
async function connectToDb() {
    const dbUsername = config_1.default.get('dbUsername');
    const dbPassword = config_1.default.get('dbPassword');
    try {
        await mongoose_1.default.connect(`mongodb+srv://${dbUsername}:${dbPassword}@cluster0.ugzhy.mongodb.net/flightTicketDB?retryWrites=true&w=majority`);
        logger_1.default.info('Connect to DB');
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}
exports.default = connectToDb;
