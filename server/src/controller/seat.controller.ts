import { createSeatInput, updateSeatInput, verifySeatIdInput } from '@/schema/seat.schema';
import { getConfigrugationValue } from '@/service/config.service';
import {
  countSeats,
  createSeat,
  existsBySeatClassnameAndExceptId,
  getAllSeats,
  updateSeat,
} from '@/service/seat.service';
import { Request, Response } from 'express';

export async function createSeatHandler(req: Request<any, any, createSeatInput>, res: Response) {
  try {
    const config = await getConfigrugationValue();
    const seatsAmount = await countSeats();

    if (!config) throw new Error('Configuration environment variable not found');

    if (seatsAmount >= config.seatClassAmountMax)
      return res.status(400).send({
        message: `Amount of SeatClass has reached the limit`,
      });

    const seat = await createSeat(req.body);

    res.send(seat);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function updateSeatHandler(req: Request<verifySeatIdInput, any, updateSeatInput>, res: Response) {
  try {
    const { seatId } = req.params;
    const { className, extraFee } = req.body;

    const exists = await existsBySeatClassnameAndExceptId(className, seatId);
    if (exists) {
      return res.status(400).send([
        {
          message: 'Class name is exists',
          path: ['body', 'className'],
        },
      ]);
    }

    await updateSeat(seatId, {
      className,
      extraFee,
    });

    res.send('Seat class successfully updated');
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function getSeatsHandler(_req: Request, res: Response) {
  try {
    const seats = await getAllSeats();

    res.send(seats);
  } catch (err) {
    res.status(500).send(err);
  }
}
