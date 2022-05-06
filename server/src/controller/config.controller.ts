import { Request, Response } from 'express';
import { getConfigrugationValue } from '@/service/config.service';

export async function getConfigurations(_req: Request, res: Response) {
  try {
    const configs = await getConfigrugationValue();

    res.send(configs);
  } catch (err) {
    res.status(500).send(err);
  }
}
