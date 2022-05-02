import SeatModel, { Seat } from '@/model/seat.model';

export async function isSeatExist(id: string) {
  try {
    const isExists = await SeatModel.exists({ _id: id });

    return isExists;
  } catch (err: any) {
    return false;
  }
}

export async function isClassnameExist(name: string) {
  try {
    const isExists = await SeatModel.exists({ className: name });

    return !!isExists;
  } catch (err: any) {
    return false;
  }
}

export async function createSeat(seat: Partial<Seat>) {
  return SeatModel.create(seat);
}
