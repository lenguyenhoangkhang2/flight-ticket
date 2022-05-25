"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_service_1 = require("@/service/user.service");
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const initialAdmin = async () => {
    const adminInfo = config_1.default.get('initialAdmin');
    try {
        const admin = await (0, user_service_1.findUserByEmail)(adminInfo.email);
        if (!admin) {
            await (0, user_service_1.createUser)({ ...adminInfo, verified: true, isAdmin: true });
            logger_1.default.info('Admin account is created!');
        }
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = initialAdmin;
