import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Airport } from './airport.model';
import { Seat } from './seat.model';
import { User } from './user.model';

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class SeatClassAmount {
  @prop({ required: true, ref: () => Seat })
  type: Ref<Seat>;

  @prop({ required: true })
  amount: number;
}

export class Ticket {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true, ref: () => Seat })
  seat_class: Ref<Seat>;

  @prop({ required: true })
  price: number;

  @prop({ default: false })
  paid: boolean;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class Stopover {
  @prop({ required: true, ref: () => Airport })
  airport: Ref<Airport>;

  @prop({ min: 0, required: true })
  deylay: number;

  @prop()
  note?: string;
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Flight {
  @prop({ required: true })
  airline_name: string;

  @prop({ ref: () => Airport })
  from_location: Ref<Airport>;

  @prop({ ref: () => Airport })
  to_location!: Ref<Airport>;

  @prop({ type: () => [Stopover], default: [] })
  stopover?: Stopover[];

  @prop({ required: true, type: () => Date })
  departure_time: Date;

  @prop({ required: true })
  arrival_time: Date;

  @prop({ required: true, type: () => [SeatClassAmount] })
  seats: SeatClassAmount[];

  @prop({ type: () => [Ticket], default: [] })
  tickets?: Ticket[];

  @prop({ required: true, min: 0 })
  price: number;
}

const FlightModel = getModelForClass(Flight);

export default FlightModel;
