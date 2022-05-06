import { CreateUserInput, ForgotPasswordInput, VerifyUserInput, ResetPasswordInput } from '@/schema/user.schema';
import { createUser, findUserByEmail, findUserById } from '@/service/user.service';
import log from '@/utils/logger';
import sendEmail from '@/utils/mailer';
import { Request, Response } from 'express';
import { nanoid } from 'nanoid';

export async function createUserHandler(
  req: Request<Record<string, never>, Record<string, never>, CreateUserInput>,
  res: Response,
) {
  const body = req.body;

  try {
    const user = await createUser(body);
    await sendEmail({
      from: 'test@example.com',
      to: user.email,
      subject: 'Please verify your account',
      text: `verification code ${user.verificationCode}. Id: ${user._id}`,
    });

    return res.send('User successfully created');
  } catch (e: any) {
    // email exists
    if (e.code === 11000) {
      return res.status(409).send('Account email already exists');
    }

    return res.status(500).send(e.message);
  }
}

export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
  const id = req.params.id;
  const verificationCode = req.params.verificationCode;

  try {
    const user = await findUserById(id);

    if (!user) {
      return res.send('Could not verify user');
    }

    if (user.verified) {
      return res.send('User is already verified');
    }

    if (user.verificationCode === verificationCode) {
      user.verified = true;
      await user.save();
      return res.send('User seccessfully verified');
    }
  } catch (err: any) {
    return res.send('Could not verify user');
  }
}

export async function forgotPassswordHandler(
  req: Request<Record<string, never>, Record<string, never>, ForgotPasswordInput>,
  res: Response,
) {
  const message = 'If a user with that email is registerd, you will receive a password reset email.';

  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      throw Error(`User with email ${email} does not exists`);
    }

    if (!user.verified) {
      throw Error(`User is not verified`);
    }

    const passwordResetCode = nanoid();
    user.passwordResetCode = passwordResetCode;

    await user.save();
    await sendEmail({
      to: user.email,
      from: 'test@example.com',
      subject: 'Reset your password',
      text: `Password reset code: ${passwordResetCode}. Id ${user._id}`,
    });

    log.debug(`Password reset email send to ${email}`);
    return res.send(message);
  } catch (err: any) {
    log.debug(err.message);
    return res.status(500).send(err.message);
  }
}

export async function resetPasswordHandler(
  req: Request<ResetPasswordInput['params'], Record<string, never>, ResetPasswordInput['body']>,
  res: Response,
) {
  const { id, passwordResetCode } = req.params;
  const { password } = req.body;

  try {
    const user = await findUserById(id);
    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      return res.status(400).send('Could not reset user password');
    }

    user.passwordResetCode = null;
    user.password = password;

    await user.save();

    return res.send('Successfully updated password');
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
}

export async function getCurrentUserHandler(req: Request, res: Response) {
  return res.send(res.locals.user);
}
