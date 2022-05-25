import defaultConfig from 'config';
import Stripe from 'stripe';
import log from '@/utils/logger';
import express from 'express';
import { verifyJwt } from '@/utils/jwt';
import { getFlightById } from '@/service/flight.service';

const stripe = new Stripe(defaultConfig.get<string>('stripeSecretKey'), {
  apiVersion: '2020-08-27',
});

export async function stripeWebHookHandler(req: express.Request, res: express.Response) {
  const payload = req.body;
  const sig = req.headers['stripe-signature'] as string;
  const endPointSecret = defaultConfig.get<string>('stripeEndpointSecret');

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endPointSecret);
  } catch (err: any) {
    log.error(err.message);
    return res.status(400).json({ message: err.message });
  }

  const data: Stripe.Event.Data = event.data;
  const eventType: string = event.type;

  switch (eventType) {
    case 'payment_intent.succeeded':
      const pi: Stripe.PaymentIntent = data.object as Stripe.PaymentIntent;

      const { token } = pi.metadata;
      const decoded = verifyJwt<{ flightId: string; ticketIds: string[] }>(token, 'accessTokenPublicKey');

      if (!decoded) return;

      const { flightId, ticketIds } = decoded;

      const flight = await getFlightById(flightId);

      if (!flight) return;

      flight.tickets = flight.tickets.map((ticket) => {
        if (ticketIds.includes(ticket._id)) {
          ticket.paid = true;
        }

        return ticket;
      });

      await flight.save();
    default:
      break;
  }

  return res.send({ seccess: true });
}
