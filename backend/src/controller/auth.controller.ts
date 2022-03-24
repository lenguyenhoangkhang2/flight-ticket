import { CreateSessionInput } from "@/schema/auth.schema";
import {
  findSessionById,
  signAccessToken,
  signRefreshToken,
} from "@/service/auth.service";
import { findUserByEmail, findUserById } from "@/service/user.service";
import { verifyJwt } from "@/utils/jwt";
import { Request, Response } from "express";
import { get } from "lodash";

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response
) {
  const message = "Invalid email or password";
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    return res.send(message);
  }

  if (!user.verified) {
    return res.send("Please verify your email");
  }

  const isValid = await user.validatePassword(password);

  if (!isValid) {
    return res.send(message);
  }

  // sign a access token
  const accessToken = signAccessToken(user);

  // sign a refresh token
  const refreshToken = await signRefreshToken({ userId: user._id });

  // send the tokens
  return res.send({
    accessToken,
    refreshToken,
  });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
  const errMessage = "Could not refresh access token";

  const refreshToken = get(req, "headers.x-refresh");

  const decoded = verifyJwt<{ session: string }>(
    refreshToken,
    "refreshTokenPublicKey"
  );

  if (!decoded) {
    return res.status(401).send(errMessage);
  }

  const session = await findSessionById(decoded.session);

  if (!session || !session.valid) {
    return res.status(401).send(errMessage);
  }

  const user = await findUserById(String(session.user));

  if (!user) {
    return res.status(401).send(errMessage);
  }

  const accessToken = signAccessToken(user);

  return res.send({ accessToken });
}
