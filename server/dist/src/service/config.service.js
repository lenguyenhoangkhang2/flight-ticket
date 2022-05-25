"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfigrugationValue = exports.existsConfig = exports.updateConfig = void 0;
const configuration_model_1 = __importDefault(require("@/model/configuration.model"));
async function updateConfig(config) {
    await configuration_model_1.default.findOneAndUpdate({}, config, { sort: { $natural: -1 } });
}
exports.updateConfig = updateConfig;
async function existsConfig() {
    try {
        return !!(await configuration_model_1.default.findOne({}).sort({ $natural: -1 }));
    }
    catch (err) {
        return false;
    }
}
exports.existsConfig = existsConfig;
async function getConfigrugationValue() {
    return configuration_model_1.default.findOne({}).sort({ $natural: -1 });
}
exports.getConfigrugationValue = getConfigrugationValue;
