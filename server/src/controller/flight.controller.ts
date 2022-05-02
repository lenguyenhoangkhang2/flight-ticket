import { createFlightInput } from '@/schema/flight.schema';
import { Request, Response } from 'express';

export async function createFlightHandler(req: Request<any, any, createFlightInput>, res: Response) {
  return res.status(200).send(req.body);
}
