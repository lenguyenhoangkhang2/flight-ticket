import { createSeatInput } from '@/schema/seat.schema';
import { createSeat } from '@/service/seat.service';
import { Request, Response } from 'express';

export async function createSeatHandler(req: Request<any, any, createSeatInput>, res: Response) {
  try {
    await createSeat(req.body);

    res.send('Seat class successfully created');
  } catch (err) {
    res.status(500).send(err);
  }
}
