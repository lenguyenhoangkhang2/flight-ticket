import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';

@index({ createdAt: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: {
      updatedAt: false,
    },
  },
})
export class Configuration {
  @prop({ required: true })
  airportAmountMax: number;

  @prop({ required: true })
  flightTimeMin: number;

  @prop({ required: true })
  numberStopoverMax: number;

  @prop({ required: true })
  timeDelayMin: number;

  @prop({ required: true })
  timeDelayMax: number;

  @prop({ required: true })
  timeLimitBuyTicket: number;

  @prop({ required: true })
  timeLimitCancelTicket: number;
}

const ConfigurationModel = getModelForClass(Configuration);

export default ConfigurationModel;
