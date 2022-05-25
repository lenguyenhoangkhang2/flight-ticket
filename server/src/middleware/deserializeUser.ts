import { UserPrivateFields } from '@/model/user.model';
import { findSessionById, signAccessToken } from '@/service/auth.service';
import { findUserById } from '@/service/user.service';
import { verifyJwt } from '@/utils/jwt';
import dayjs from 'dayjs';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
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
    accessTokenDecoded = verifyJwt<{ sessionId: string }>(accessToken, 'accessTokenPublicKey');

    const session = await findSessionById(accessTokenDecoded?.sessionId as string);

    if (!session?.valid) {
      res.clearCookie('api-auth');
      return res.sendStatus(401);
    }
  } catch (err: any) {
    let refreshTokenDecoded;

    try {
      refreshTokenDecoded = verifyJwt<{ sessionId: string }>(refreshToken, 'refreshTokenPublicKey');

      const session = await findSessionById(refreshTokenDecoded?.sessionId as string);

      if (!session || !session?.valid) {
        res.clearCookie('api-auth');
        return res.sendStatus(401);
      }

      user = await findUserById(String(session.user));

      if (!user) {
        res.clearCookie('api-auth');
        return res.sendStatus(401);
      }

      const accessToken = signAccessToken(user, session);

      res.cookie(
        'api-auth',
        { accessToken, refreshToken },
        {
          secure: false,
          httpOnly: true,
          expires: dayjs().add(1, 'y').toDate(),
        },
      );

      res.locals.user = _.omit({ ...user.toObject(), sessionId: session._id }, UserPrivateFields);
      return next();
    } catch (err) {
      res.clearCookie('api-auth');
      return res.sendStatus(401);
    }
  }

  res.locals.user = accessTokenDecoded;

  return next();
};

export default deserializeUser;
