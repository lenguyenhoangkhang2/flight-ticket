import { verifyJwt } from '@/utils/jwt';
import { Request, Response, NextFunction } from 'express';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken = (req.headers.authorization || '').replace(/^Bearer\s/, '');

  if (!accessToken) {
    return next();
  }

  let decoded;

  try {
    decoded = verifyJwt(accessToken, 'accessTokenPublicKey');
  } catch (err: any) {
    return res.send({
      code: 401,
      message: err.message,
    });
  }

  if (decoded) {
    res.locals.user = decoded;

    return next();
  }

  return next();
};

export default deserializeUser;
