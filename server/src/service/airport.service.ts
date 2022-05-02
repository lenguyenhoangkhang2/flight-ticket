import AirportModel from '@/model/airport.model';

export async function isAirportExist(id: string) {
  try {
    const isExists = await AirportModel.findById({ _id: id });

    return isExists;
  } catch (err: any) {
    return false;
  }
}
