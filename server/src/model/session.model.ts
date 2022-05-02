import { getModelForClass, index, prop, Ref } from '@typegoose/typegoose';
import { User } from './user.model';

@index({
  user: 1,
})
export class Session {
  @prop({ ref: () => User })
  user: Ref<User>;

  @prop({ type: () => Date, default: Date.now(), expires: 3600 * 30 * 24 })
  createdAt: Date;
}

const SessionModel = getModelForClass(Session);

export default SessionModel;
