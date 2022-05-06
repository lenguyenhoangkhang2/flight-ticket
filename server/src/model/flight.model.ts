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
  type: Ref<Seat, string>;

  @prop({ required: true })
  amount: number;
}

export class Ticket {
  @prop({ required: true, ref: () => User })
  user: Ref<User, string>;

  @prop({ required: true, ref: () => Seat })
  seatClass: Ref<Seat, string>;

  @prop({ required: true })
  price: number;

  @prop({ default: false })
  paid: boolean;

  @prop({ default: true })
  idValid: boolean;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class Stopover {
  @prop({ required: true, ref: () => Airport })
  airport: Ref<Airport, string>;

  @prop({ min: 0, required: true })
  delay: number;

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
  airline: string;

  @prop({ ref: () => Airport })
  fromLocation: Ref<Airport, string>;

  @prop({ ref: () => Airport })
  toLocation: Ref<Airport, string>;

  @prop({ type: () => [Stopover], default: [] })
  stopovers: Stopover[];

  @prop({ required: true, type: () => Date })
  departureTime: Date;

  @prop({ required: true })
  arrivalTime: Date;

  @prop({ required: true, min: 0 })
  price: number;

  @prop({ required: true, type: () => [SeatClassAmount] })
  seats: SeatClassAmount[];

  @prop({ type: () => [Ticket], default: [] })
  tickets: Ticket[];

  @prop({ required: true, type: () => Date })
  timeForPaymentTicket: Date;
}

const FlightModel = getModelForClass(Flight);

export default FlightModel;
