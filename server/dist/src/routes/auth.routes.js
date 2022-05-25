"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = require("@/controller/auth.controller");
const requireUser_1 = __importDefault(require("@/middleware/requireUser"));
const validateResourse_1 = __importDefault(require("@/middleware/validateResourse"));
const auth_schema_1 = require("@/schema/auth.schema");
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/api/sessions', (0, validateResourse_1.default)(auth_schema_1.createSessionSchema), auth_controller_1.createSessionHandler);
router.post('/api/sessions/logout', requireUser_1.default, auth_controller_1.deleteSessionHandler);
exports.default = router;
