import { Request, Response, NextFunction } from 'express';

const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;
  if (!user || !user.isAdmin) {
    return res.sendStatus(403);
  }

  return next();
};

export default requireAdmin;
