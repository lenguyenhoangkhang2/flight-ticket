import AirportModel, { Airport } from '@/model/airport.model';

export async function existsByAirportId(id: string) {
  try {
    const isExists = await AirportModel.exists({ _id: id });

    return isExists;
  } catch (err: any) {
    return null;
  }
}

export async function existsByAirportName(name: string) {
  try {
    const isExists = await AirportModel.exists({ name: name });

    return isExists;
  } catch (err: any) {
    return null;
  }
}

export async function existsByAirportNameAndExceptId(name: string, id: string) {
  try {
    const isExists = await AirportModel.findOne({ _id: { $nin: [id] }, name: name });

    return isExists?._id;
  } catch (err) {
    return null;
  }
}

export async function findAirportById(id: string) {
  return AirportModel.findById(id);
}

export async function createAirport(airport: Partial<Airport>) {
  return AirportModel.create(airport);
}

export async function updateAirport(id: string, airport: Partial<Airport>) {
  return AirportModel.findByIdAndUpdate(id, airport);
}

export async function findAllAirports() {
  return AirportModel.find({});
}

export async function countAirports() {
  return AirportModel.countDocuments();
}
