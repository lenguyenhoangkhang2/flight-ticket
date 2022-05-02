import SessionModel from '@/model/session.model';
import { UserPrivateFields, User } from '@/model/user.model';
import { signJwt } from '@/utils/jwt';
import { DocumentType } from '@typegoose/typegoose';
import { omit } from 'lodash';

export async function createSession({ userId }: { userId: string }) {
  return SessionModel.create({ user: userId });
}

export async function signRefreshToken({ userId }: { userId: string }) {
  const session = await createSession({ userId });
  const refreshToken = signJwt(
    {
      session: session._id,
    },
    'refreshTokenPrivateKey',
    {
      // expiresIn: '60 days',
      expiresIn: '60 days',
    },
  );

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>) {
  const payload = omit(user.toJSON(), UserPrivateFields);

  const accessToken = signJwt(payload, 'accessTokenPrivateKey', {
    expiresIn: '1h',
  });

  return accessToken;
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}
