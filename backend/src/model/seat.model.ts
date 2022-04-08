import { getModelForClass, prop } from '@typegoose/typegoose';

export class Seat {
  @prop({ required: true, unique: true })
  className: string;

  @prop({ required: true })
  extraFee: number;
}

const SeatModel = getModelForClass(Seat);

export default SeatModel;
