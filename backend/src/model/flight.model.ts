import { getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Airport } from './airport.model';
import { User } from './user.model';

export enum Seat {
  'FIRST_CLASS',
  'SECOND_CLASS',
}

export class Ticket {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true })
  seat_class: Seat;

  @prop({ required: true })
  price: number;

  @prop({ default: false })
  paid: boolean;
}

export class Stopover {
  @prop({ required: true, ref: () => Airport })
  airport: Ref<Airport>;

  @prop({ min: 0, required: true })
  @prop()
  deylay: number;
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

  @prop({ required: true, type: () => [Seat] })
  seats: Seat[];

  @prop({ type: () => [Ticket], default: [] })
  tickets?: Ticket[];
}

const FlightModel = getModelForClass(Flight);

export default FlightModel;
