import { createUser, findUserByEmail } from '@/service/user.service';
import config from 'config';
import log from './logger';

const initialAdmin = async () => {
  const adminInfo = config.get<{
    email: string;
    password: string;
    identityCardNumber: string;
    name: string;
  }>('initialAdmin');

  try {
    const admin = await findUserByEmail(adminInfo.email);

    if (!admin) {
      await createUser({ ...adminInfo, verified: true, isAdmin: true });
      log.info('Admin account is created!');
    }
  } catch (err) {
    console.log(err);
  }
};

export default initialAdmin;
