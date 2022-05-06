import ConfigurationModel, { Configuration } from '@/model/configuration.model';

export async function updateConfig(config: Partial<Configuration>) {
  await ConfigurationModel.findOneAndUpdate({}, config, { sort: { createdAt: -1 } });
}

export async function existsConfig() {
  try {
    return !!(await ConfigurationModel.findOne({}).sort({ $natural: -1 }));
  } catch (err) {
    return false;
  }
}

export async function getConfigrugationValue() {
  return ConfigurationModel.findOne({}).sort({ $natural: -1 });
}
