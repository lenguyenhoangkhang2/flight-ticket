import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';

@index({ fileName: 1 })
@modelOptions({ schemaOptions: { timestamps: true } })
export class Report {
  @prop({ required: true })
  fileName: string;

  @prop({ required: true, type: () => Date })
  fromTime: Date;

  @prop({ required: true, type: () => Date })
  toTime: Date;
}

const ReportModel = getModelForClass(Report);

export default ReportModel;
