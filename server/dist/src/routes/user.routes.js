"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_schema_1 = require("@/schema/user.schema");
const express_1 = __importDefault(require("express"));
const validateResourse_1 = __importDefault(require("@/middleware/validateResourse"));
const user_controller_1 = require("@/controller/user.controller");
const requireUser_1 = __importDefault(require("@/middleware/requireUser"));
const router = express_1.default.Router();
router.post('/api/users', (0, validateResourse_1.default)(user_schema_1.createUseSchema), user_controller_1.createUserHandler);
router.post('/api/users/verify', (0, validateResourse_1.default)(user_schema_1.verifyUserSchema), user_controller_1.verifyUserHandler);
router.post('/api/users/forgot-password', (0, validateResourse_1.default)(user_schema_1.forgotPasswordSchema), user_controller_1.forgotPassswordHandler);
router.post('/api/users/reset-password/:id/:passwordResetCode', (0, validateResourse_1.default)(user_schema_1.resetPasswordSchema), user_controller_1.resetPasswordHandler);
router.get('/api/users/me', requireUser_1.default, user_controller_1.getCurrentUserHandler);
exports.default = router;
