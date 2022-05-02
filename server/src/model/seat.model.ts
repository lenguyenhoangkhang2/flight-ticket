import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Seat {
  @prop({ required: true, unique: true })
  className: string;

  @prop({ required: true })
  extraFee: number;
}

const SeatModel = getModelForClass(Seat);

export default SeatModel;
