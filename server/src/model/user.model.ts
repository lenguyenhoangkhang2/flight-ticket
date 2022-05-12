import { getModelForClass, modelOptions, pre, prop, Severity, DocumentType, index } from '@typegoose/typegoose';
import { nanoid } from 'nanoid';
import argon2 from 'argon2';
import log from '@/utils/logger';

export const UserPrivateFields = [
  'password',
  '__v',
  'verificationCode',
  'passwordResetCode',
  'verified',
  'createdAt',
  'updatedAt',
];

@pre<User>('save', async function () {
  if (!this.isModified('password')) return;

  const hash = await argon2.hash(this.password);

  this.password = hash;
  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: Severity.WARN,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  identityCardNumber: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: false })
  isAdmin?: boolean;

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      log.error(e, 'Could not validate password');
      return false;
    }
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
