// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/// <reference types="stripe-event-types" />

import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { STRIPE_SECRET_KEY, STRIPE_WH_SECRET } from "../../../lib/env";
import { supamaster } from "../../../lib/supabase";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const stripe = require("stripe")(STRIPE_SECRET_KEY);
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  const sig = req.headers["stripe-signature"];
  const reqBuf = await buffer(req);

  if (!sig) {
    return res.status(400).send(`Webhook Error: No signature found`);
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      reqBuf,
      sig,
      STRIPE_WH_SECRET
    ) as Stripe.DiscriminatedEvent;
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err?.message}`);
  }

  let response;
  // Handle the event
  switch (event.type) {
    case "customer.subscription.created":
      response = await supamaster.from("billing").update({
        subscribed: true
      }).eq("stripe_customer_id", event.data.object.customer);
      break;
    case "customer.subscription.deleted":
      response = await supamaster.from("billing").update({
        subscribed: false
      }).eq("stripe_customer_id", event.data.object.customer);
      break;
    default:
      break;
  }

  if (response?.error) {
    return res.status(response.status).json({ text: response.statusText });
  }

  return res.status(200); //.json({ received: true, data: response?.data });
}
