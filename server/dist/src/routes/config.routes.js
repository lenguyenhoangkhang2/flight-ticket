"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_controller_1 = require("@/controller/config.controller");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/api/configs', config_controller_1.getConfigurationHandler);
router.put('/api/configs', config_controller_1.updateConfigurationHandler);
exports.default = router;
