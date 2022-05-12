import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@index({
  user: 1,
})
export class Session {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true, default: true })
  valid?: boolean;

  @prop({ required: true, type: () => Date, default: Date.now(), expires: 3600 * 30 * 24 })
  createdAt: Date;
}

const SessionModel = getModelForClass(Session);

export default SessionModel;
