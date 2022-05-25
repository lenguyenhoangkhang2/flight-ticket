"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const configuration_model_1 = __importDefault(require("@/model/configuration.model"));
const config_service_1 = require("@/service/config.service");
const config_1 = __importDefault(require("config"));
const logger_1 = __importDefault(require("./logger"));
const initialConfig = async () => {
    try {
        const initConfig = config_1.default.get('initialConfig');
        const exists = await (0, config_service_1.existsConfig)();
        if (!exists) {
            await configuration_model_1.default.create(initConfig);
            logger_1.default.info('Initial configurations are saved successfully to DB');
        }
    }
    catch (err) {
        throw new Error('Initial Config Error!' + err.message);
    }
};
exports.default = initialConfig;
