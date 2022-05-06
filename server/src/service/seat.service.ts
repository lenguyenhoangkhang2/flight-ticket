import SeatModel, { Seat } from '@/model/seat.model';

export async function existsBySeatId(id: string) {
  try {
    const isExists = await SeatModel.exists({ _id: id });

    return isExists;
  } catch (err: any) {
    return null;
  }
}

export async function existsBySeatClassname(name: string) {
  try {
    const isExists = await SeatModel.findOne({ className: name });

    return isExists;
  } catch (err: any) {
    return null;
  }
}

export async function existsBySeatClassnameAndExceptId(name: string, id: string) {
  try {
    const isExists = await SeatModel.findOne({ _id: { $nin: [id] }, className: name });

    return !!isExists;
  } catch (err) {
    return false;
  }
}

export async function createSeat(seat: Partial<Seat>) {
  return SeatModel.create(seat);
}

export async function updateSeat(id: string, seat: Partial<Seat>) {
  return SeatModel.findByIdAndUpdate(id, seat);
}

export async function getAllSeats() {
  return SeatModel.find({});
}

export async function countSeats() {
  return SeatModel.countDocuments();
}
