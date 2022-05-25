"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = exports.signRefreshToken = exports.updateSession = exports.findSessionById = exports.createSession = void 0;
const session_model_1 = __importDefault(require("@/model/session.model"));
const user_model_1 = require("@/model/user.model");
const jwt_1 = require("@/utils/jwt");
const lodash_1 = __importDefault(require("lodash"));
const config_1 = __importDefault(require("config"));
async function createSession(user) {
    return session_model_1.default.create({ user });
}
exports.createSession = createSession;
async function findSessionById(id) {
    return session_model_1.default.findById(id);
}
exports.findSessionById = findSessionById;
async function updateSession(query, update) {
    return session_model_1.default.updateOne(query, update);
}
exports.updateSession = updateSession;
async function signRefreshToken(session) {
    const refreshTokenTtl = config_1.default.get('refreshTokenTtl');
    const refreshToken = (0, jwt_1.signJwt)({
        sessionId: session._id,
    }, 'refreshTokenPrivateKey', {
        expiresIn: refreshTokenTtl,
    });
    return refreshToken;
}
exports.signRefreshToken = signRefreshToken;
function signAccessToken(user, session) {
    const payload = lodash_1.default.omit(user.toJSON(), user_model_1.UserPrivateFields);
    const accessToken = (0, jwt_1.signJwt)({ ...payload, sessionId: session._id }, 'accessTokenPrivateKey', {
        expiresIn: config_1.default.get('accessTokenTtl'),
    });
    return accessToken;
}
exports.signAccessToken = signAccessToken;
