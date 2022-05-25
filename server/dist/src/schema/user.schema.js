"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.verifyUserSchema = exports.createUseSchema = void 0;
const zod_1 = require("zod");
exports.createUseSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)({
            required_error: 'Name is required',
        }),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(6, 'Password is too short = should be min 6 chars'),
        passwordConfirmation: (0, zod_1.string)({
            required_error: 'Password confirmation is required',
        }),
        identityCardNumber: (0, zod_1.string)({
            required_error: 'Identity Card Number is required',
        }),
        email: (0, zod_1.string)({
            required_error: 'Email is required',
        }).email('Not a valid email'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Password do not match',
        path: ['passwordConfirmation'],
    }),
});
exports.verifyUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        id: (0, zod_1.string)(),
        verificationCode: (0, zod_1.string)(),
    }),
});
exports.forgotPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({ required_error: 'Email is required' }).email('Not a valid email'),
    }),
});
exports.resetPasswordSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)(),
        passwordResetCode: (0, zod_1.string)(),
    }),
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(6, 'Password is too short = should be min 6 chars'),
        passwordConfirmation: (0, zod_1.string)({
            required_error: 'Password confirmation is required',
        }),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Password confirm do not match',
        path: ['passwordConfirmation'],
    }),
});
