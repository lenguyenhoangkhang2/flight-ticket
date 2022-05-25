import { Request, Response } from 'express';
import { getConfigrugationValue, updateConfig } from '@/service/config.service';
import { updateConfigInput } from '@/schema/config.schema';

export async function getConfigurationHandler(_req: Request, res: Response) {
  const configs = await getConfigrugationValue();

  res.send(configs);
}

export async function updateConfigurationHandler(req: Request<any, any, updateConfigInput>, res: Response) {
  await updateConfig(req.body);

  res.send('Cập nhật cấu hình cài đặt thành công');
}
