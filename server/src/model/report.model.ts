import { getDiscriminatorModelForClass, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Flight } from './flight.model';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class Report {
  @prop({ required: true, type: () => Date })
  time: Date;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class MonthReportItem {
  @prop({ required: true, ref: () => Flight })
  flightId!: Ref<Flight>;

  @prop({ required: true, min: 0 })
  ticketSelledAmount!: number;

  @prop({ required: true })
  revenue!: number;

  @prop({ required: true })
  rate!: number;
}

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class YearReportItem {
  @prop({ required: true, min: 1, max: 12 })
  month!: number;

  @prop({ required: true })
  flightAmount!: number;

  @prop({ required: true })
  revenue!: number;

  @prop({ required: true })
  rate!: number;
}

class MonthReport extends Report {
  @prop({ type: () => [MonthReportItem], required: true, default: [] })
  items: MonthReportItem[];
}

class YearReport extends Report {
  @prop({ type: () => [YearReportItem], required: true, default: [] })
  items: YearReportItem[];
}

export const ReportModel = getModelForClass(Report);
export const MonthReportModel = getDiscriminatorModelForClass(ReportModel, MonthReport);
export const YearReportModel = getDiscriminatorModelForClass(ReportModel, YearReport);
