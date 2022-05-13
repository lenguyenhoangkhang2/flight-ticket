import { object, string, TypeOf } from 'zod';

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: 'Email is required',
    }).email(),
    password: string({
      required_error: 'Password is required',
    }).min(6),
  }),
});

export const refreshTokenSchema = object({
  body: object({
    refreshToken: string({
      required_error: 'RefreshToken is required',
    }),
  }),
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];
