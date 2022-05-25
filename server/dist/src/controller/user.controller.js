"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserHandler = exports.resetPasswordHandler = exports.forgotPassswordHandler = exports.verifyUserHandler = exports.createUserHandler = void 0;
const user_service_1 = require("@/service/user.service");
const logger_1 = __importDefault(require("@/utils/logger"));
const mailer_1 = __importDefault(require("@/utils/mailer"));
const nanoid_1 = require("nanoid");
const config_1 = __importDefault(require("config"));
async function createUserHandler(req, res) {
    const body = req.body;
    try {
        const user = await (0, user_service_1.createUser)(body);
        await (0, mailer_1.default)({
            from: 'test@example.com',
            to: user.email,
            subject: 'Please verify your account',
            text: `Click link to verify your account. ${config_1.default.get('clientHost')}/verify-account/${user.verificationCode}/${user._id}`,
        });
        return res.send('User successfully created');
    }
    catch (e) {
        // email exists
        if (e.code === 11000) {
            return res.status(409).send([
                {
                    path: ['body', 'email'],
                    message: 'Account email already exists',
                },
            ]);
        }
        return res.status(500).send({
            path: ['body'],
            message: e.message,
        });
    }
}
exports.createUserHandler = createUserHandler;
async function verifyUserHandler(req, res) {
    const { id, verificationCode } = req.body;
    const user = await (0, user_service_1.findUserById)(id);
    if (!user) {
        return res.status(400).send('Could not verify user');
    }
    if (user.verified) {
        return res.status(400).send('User is already verified');
    }
    if (user.verificationCode === verificationCode) {
        user.verified = true;
        await user.save();
        res.send('User seccessfully verified');
    }
    else {
        res.status(400).send('Could not verify user');
    }
}
exports.verifyUserHandler = verifyUserHandler;
async function forgotPassswordHandler(req, res) {
    const message = 'You will receive a password reset email.';
    const { email } = req.body;
    try {
        const user = await (0, user_service_1.findUserByEmail)(email);
        if (!user) {
            return res.status(400).send({
                message: `User with email ${email} does not exists`,
            });
        }
        if (!user.verified) {
            return res.status(400).send({
                message: 'User is not verified',
            });
        }
        const passwordResetCode = (0, nanoid_1.nanoid)();
        user.passwordResetCode = passwordResetCode;
        await user.save();
        await (0, mailer_1.default)({
            to: user.email,
            from: 'test@example.com',
            subject: 'Reset your password',
            text: `Link to reset your password ${config_1.default.get('clientHost')}/reset-password/${user._id}/${passwordResetCode}`,
        });
        logger_1.default.debug(`Password reset email send to ${email}`);
        return res.send({ message });
    }
    catch (err) {
        logger_1.default.debug(err.message);
        return res.status(500).send(err.message);
    }
}
exports.forgotPassswordHandler = forgotPassswordHandler;
async function resetPasswordHandler(req, res) {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    try {
        const user = await (0, user_service_1.findUserById)(id);
        if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
            return res.status(400).send('Could not reset user password');
        }
        user.passwordResetCode = null;
        user.password = password;
        await user.save();
        return res.send('Successfully updated password');
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}
exports.resetPasswordHandler = resetPasswordHandler;
async function getCurrentUserHandler(req, res) {
    return res.send(res.locals.user);
}
exports.getCurrentUserHandler = getCurrentUserHandler;
