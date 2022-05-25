import ConfigurationModel from '@/model/configuration.model';
import { existsConfig } from '@/service/config.service';
import config from 'config';
import log from './logger';

const initialConfig = async () => {
  try {
    const initConfig = config.get<{
      airportAmountMax: string;
      flightTimeMin: string;
      numberStopoverMax: string;
      timeDelayMin: string;
      timeDelayMax: string;
      timeLimitBuyTicket: string;
      timeLimitCancelTicket: string;
    }>('initialConfig');

    const exists = await existsConfig();
    if (!exists) {
      await ConfigurationModel.create(initConfig);
      log.info('Initial configurations are saved successfully to DB');
    }
  } catch (err: any) {
    throw new Error('Initial Config Error!' + err.message);
  }
};

export default initialConfig;
