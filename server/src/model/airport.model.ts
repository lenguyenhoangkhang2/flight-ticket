import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Airport {
  @prop({ required: true, unique: true })
  name: string;

  @prop({ required: true })
  location: string;
}

const AirportModel = getModelForClass(Airport);

export default AirportModel;
