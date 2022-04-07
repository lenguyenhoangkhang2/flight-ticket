import { getModelForClass, prop } from '@typegoose/typegoose';

export class Airport {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  location: string;
}

const AirportModel = getModelForClass(Airport, {
  schemaOptions: {
    timestamps: true,
  },
});

export default AirportModel;
