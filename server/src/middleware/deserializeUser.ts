import { findSessionById } from '@/service/auth.service';
import { verifyJwt } from '@/utils/jwt';
import { Request, Response, NextFunction } from 'express';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/sessions/refresh') {
    return next();
  }

  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

  if (!accessToken) {
    return next();
  }

  let decoded;

  try {
    decoded = verifyJwt<{ sessionId: string }>(accessToken, 'accessTokenPublicKey');
  } catch (err: any) {
    return res.status(401).send({
      message: 'jwt error',
    });
  }

  if (decoded) {
    const session = await findSessionById(decoded?.sessionId);

    if (!session?.valid) {
      return res.status(401).send({
        message: 'Session is not valid',
      });
    }
  }

  res.locals.user = decoded;

  return next();
};

export default deserializeUser;
