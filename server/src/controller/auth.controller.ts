import { CreateSessionInput } from '@/schema/auth.schema';
import {
  createSession,
  findSessionById,
  removeSession,
  signAccessToken,
  signRefreshToken,
} from '@/service/auth.service';
import { findUserByEmail, findUserById } from '@/service/user.service';
import { verifyJwt } from '@/utils/jwt';
import { Request, Response } from 'express';
import _ from 'lodash';

export async function createSessionHandler(req: Request<unknown, unknown, CreateSessionInput>, res: Response) {
  const message = 'Invalid email or password';

  // Lay email, password duoc gui tu request
  const { email, password } = req.body;

  // Lay user dua tren email
  const user = await findUserByEmail(email);

  // Kiem tra co tai khoan tra ve
  if (!user) {
    return res.send(message);
  }

  // Kiem tra tai khoan da duoc xac minh
  if (!user.verified) {
    return res.send('Please verify your email');
  }

  // Kiem tra mat khau co dung khong
  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  const session = await createSession(user);

  const accessToken = signAccessToken(user, session);
  const refreshToken = await signRefreshToken(session);

  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const refreshToken = _.get(req, 'headers.x-refresh');

  const decoded = verifyJwt<{ session: string }>(refreshToken, 'refreshTokenPublicKey');

  if (!decoded) {
    return res.status(401).send('Could not refresh access token');
  }

  const session = await findSessionById(decoded.session);

  if (!session) {
    return res.status(401).send('Could not refresh access token');
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send('Could not refresh access token');
  }

  const accessToken = signAccessToken(user, session);

  return res.send({ accessToken });
}

export async function deleteSessionHandler(req: Request, res: Response) {
  const sessionId = res.locals.user.sessionId;

  await removeSession(sessionId);

  return res.send({
    accessToken: null,
    refreshToken: null,
  });
}
