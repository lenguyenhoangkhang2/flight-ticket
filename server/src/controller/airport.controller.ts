import { createAirportInput, updateAirportInput, verifyAirportIdInput } from '@/schema/airport.schema';
import {
  createAirport,
  updateAirport,
  existsByAirportNameAndExceptId,
  findAllAirports,
  countAirports,
} from '@/service/airport.service';
import { getConfigrugationValue } from '@/service/config.service';
import { Request, Response } from 'express';

export async function getAirportsHandler(req: Request, res: Response) {
  try {
    const airpots = await findAllAirports();
    res.send(airpots);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function createAirportHandler(req: Request<any, any, createAirportInput>, res: Response) {
  try {
    const config = await getConfigrugationValue();
    const airportsAmount = await countAirports();

    if (!config) throw new Error('Configuration environment variable not found');

    if (airportsAmount >= config.airportAmountMax)
      return res.status(400).send({
        message: `Amount of airports has reached the limit`,
      });

    const airport = await createAirport(req.body);

    res.send(airport);
  } catch (err) {
    res.status(500).send(err);
  }
}

export async function updateAirportHandler(req: Request<verifyAirportIdInput, any, updateAirportInput>, res: Response) {
  try {
    const { airportId } = req.params;
    const { name, location } = req.body;

    const exists = await existsByAirportNameAndExceptId(name, airportId);

    if (exists) {
      return res.status(400).send({
        message: 'Name is exists',
        path: ['body', 'name'],
      });
    }

    await updateAirport(airportId, {
      name,
      location,
    });

    res.send('Airport class successfully updated');
  } catch (err) {
    res.status(500).send(err);
  }
}
