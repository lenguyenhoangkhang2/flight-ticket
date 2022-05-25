"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSessionHandler = exports.createSessionHandler = void 0;
const auth_service_1 = require("@/service/auth.service");
const user_service_1 = require("@/service/user.service");
const dayjs_1 = __importDefault(require("dayjs"));
async function createSessionHandler(req, res) {
    // Lay email, password duoc gui tu request
    const { email, password } = req.body;
    // Lay user dua tren email
    const user = await (0, user_service_1.findUserByEmail)(email);
    // Kiem tra co tai khoan tra ve
    if (!user) {
        return res.status(404).send([
            {
                path: ['body', 'email'],
                message: 'Email not found',
            },
        ]);
    }
    // Kiem tra tai khoan da duoc xac minh
    if (!user.verified) {
        return res.status(400).send([
            {
                path: ['body'],
                message: 'Please verify your email',
            },
        ]);
    }
    // Kiem tra mat khau co dung khong
    const isValid = await user.validatePassword(password);
    if (!isValid) {
        return res.status(400).send([
            {
                path: ['body', 'password'],
                message: 'Invalid password',
            },
        ]);
    }
    const session = await (0, auth_service_1.createSession)(user);
    const accessToken = (0, auth_service_1.signAccessToken)(user, session);
    const refreshToken = await (0, auth_service_1.signRefreshToken)(session);
    res.cookie('api-auth', { accessToken, refreshToken }, {
        secure: false,
        httpOnly: true,
        expires: (0, dayjs_1.default)().add(1, 'y').toDate(),
    });
    return res.sendStatus(200);
}
exports.createSessionHandler = createSessionHandler;
async function deleteSessionHandler(req, res) {
    const sessionId = res.locals.user.sessionId;
    await (0, auth_service_1.updateSession)({ _id: sessionId }, { valid: false });
    res.clearCookie('api-auth');
    return res.sendStatus(200);
}
exports.deleteSessionHandler = deleteSessionHandler;
// export async function refreshAccessTokenHandler(req: Request, res: Response) {
//   // const refreshToken = _.get(req, 'headers.x-refresh');
//   const { refreshToken } = req.cookies['api-auth'];
//   const decoded = verifyJwt<{ sessionId: string }>(refreshToken, 'refreshTokenPublicKey');
//   if (!decoded) {
//     res.clearCookie('api-auth');
//     return res.sendStatus(401);
//   }
//   const session = await findSessionById(decoded.sessionId);
//   if (!session || !session?.valid) {
//     res.clearCookie('api-auth');
//     return res.sendStatus(401);
//   }
//   const user = await findUserById(String(session.user));
//   if (!user) {
//     res.clearCookie('api-auth');
//     return res.sendStatus(401);
//   }
//   const accessToken = signAccessToken(user, session);
//   res.cookie(
//     'api-auth',
//     { accessToken, refreshToken },
//     {
//       secure: false,
//       httpOnly: true,
//       expires: dayjs().add(1, 'y').toDate(),
//     },
//   );
//   return res.sendStatus(200);
// }
