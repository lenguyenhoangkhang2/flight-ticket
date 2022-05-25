import { CreateSessionInput } from '@/schema/auth.schema';
import { createSession, signAccessToken, signRefreshToken, updateSession } from '@/service/auth.service';
import { findUserByEmail } from '@/service/user.service';
import dayjs from 'dayjs';
import { Request, Response } from 'express';

export async function createSessionHandler(req: Request<unknown, unknown, CreateSessionInput>, res: Response) {
  // Lay email, password duoc gui tu request
  const { email, password } = req.body;

  // Lay user dua tren email
  const user = await findUserByEmail(email);

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

  const session = await createSession(user);
  const accessToken = signAccessToken(user, session);

  const refreshToken = await signRefreshToken(session);

  res.cookie(
    'api-auth',
    { accessToken, refreshToken },
    {
      secure: false,
      httpOnly: true,
      expires: dayjs().add(1, 'y').toDate(),
    },
  );

  return res.sendStatus(200);
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.sessionId;

  await updateSession({ _id: sessionId }, { valid: false });

  res.clearCookie('api-auth');

  return res.sendStatus(200);
}

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
