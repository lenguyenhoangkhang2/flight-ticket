import { getModelForClass, index, modelOptions, prop } from '@typegoose/typegoose';

export enum EReportType {
  'MONTH',
  'YEAR',
}

@index({ fileName: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Report {
  @prop({ required: true })
  fileName: string;

  @prop({ required: true, type: () => EReportType })
  type: EReportType;

  @prop({ required: true, type: () => Date })
  time: Date;
}

const ReportModel = getModelForClass(Report);

export default ReportModel;
