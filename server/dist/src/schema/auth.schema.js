"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.createSessionSchema = void 0;
const zod_1 = require("zod");
exports.createSessionSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email is required',
        }).email(),
        password: (0, zod_1.string)({
            required_error: 'Password is required',
        }).min(6),
    }),
});
exports.refreshTokenSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        refreshToken: (0, zod_1.string)({
            required_error: 'RefreshToken is required',
        }),
    }),
});
