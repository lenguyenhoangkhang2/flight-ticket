import SessionModel, { Session } from '@/model/session.model';
import { User, UserPrivateFields } from '@/model/user.model';
import { signJwt } from '@/utils/jwt';
import _ from 'lodash';
import config from 'config';
import { DocumentType } from '@typegoose/typegoose';
import { FilterQuery, UpdateQuery } from 'mongoose';

export async function createSession(user: DocumentType<User>) {
  return SessionModel.create({ user });
}

export async function findSessionById(id: string) {
  return SessionModel.findById(id);
}

export async function updateSession(
  query: FilterQuery<DocumentType<Session>>,
  update: UpdateQuery<DocumentType<Session>>,
) {
  return SessionModel.updateOne(query, update);
}

export async function signRefreshToken(session: DocumentType<Session>) {
  const refreshTokenTtl = config.get<string>('refreshTokenTtl');

  const refreshToken = signJwt(
    {
      sessionId: session._id,
    },
    'refreshTokenPrivateKey',
    {
      expiresIn: refreshTokenTtl,
    },
  );

  return refreshToken;
}

export function signAccessToken(user: DocumentType<User>, session: DocumentType<Session>) {
  const payload = _.omit(user.toJSON(), UserPrivateFields);

  const accessToken = signJwt({ ...payload, sessionId: session._id }, 'accessTokenPrivateKey', {
    expiresIn: config.get('accessTokenTtl'),
  });

  return accessToken;
}
