"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("@/model/user.model");
const auth_service_1 = require("@/service/auth.service");
const user_service_1 = require("@/service/user.service");
const jwt_1 = require("@/utils/jwt");
const dayjs_1 = __importDefault(require("dayjs"));
const lodash_1 = __importDefault(require("lodash"));
const deserializeUser = async (req, res, next) => {
    debugger;
    if (req.path === '/api/sessions') {
        return next();
    }
    const apiAuth = req.cookies['api-auth'];
    if (!apiAuth) {
        return next();
    }
    const { accessToken, refreshToken } = apiAuth;
    let accessTokenDecoded, user;
    try {
        accessTokenDecoded = (0, jwt_1.verifyJwt)(accessToken, 'accessTokenPublicKey');
        const session = await (0, auth_service_1.findSessionById)(accessTokenDecoded === null || accessTokenDecoded === void 0 ? void 0 : accessTokenDecoded.sessionId);
        if (!(session === null || session === void 0 ? void 0 : session.valid)) {
            res.clearCookie('api-auth');
            return res.sendStatus(401);
        }
    }
    catch (err) {
        let refreshTokenDecoded;
        try {
            refreshTokenDecoded = (0, jwt_1.verifyJwt)(refreshToken, 'refreshTokenPublicKey');
            const session = await (0, auth_service_1.findSessionById)(refreshTokenDecoded === null || refreshTokenDecoded === void 0 ? void 0 : refreshTokenDecoded.sessionId);
            if (!session || !(session === null || session === void 0 ? void 0 : session.valid)) {
                res.clearCookie('api-auth');
                return res.sendStatus(401);
            }
            user = await (0, user_service_1.findUserById)(String(session.user));
            if (!user) {
                res.clearCookie('api-auth');
                return res.sendStatus(401);
            }
            const accessToken = (0, auth_service_1.signAccessToken)(user, session);
            res.cookie('api-auth', { accessToken, refreshToken }, {
                secure: false,
                httpOnly: true,
                expires: (0, dayjs_1.default)().add(1, 'y').toDate(),
            });
            res.locals.user = lodash_1.default.omit({ ...user.toObject(), sessionId: session._id }, user_model_1.UserPrivateFields);
            return next();
        }
        catch (err) {
            res.clearCookie('api-auth');
            return res.sendStatus(401);
        }
    }
    res.locals.user = accessTokenDecoded;
    return next();
};
exports.default = deserializeUser;
