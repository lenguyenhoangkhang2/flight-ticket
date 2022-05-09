import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

const validateResource = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    next();
  } catch (e: any) {
    return res.status(400).send(e.errors);
  }
};

export default validateResource;
