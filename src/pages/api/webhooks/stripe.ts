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
    // case "transfer.created":
    //   // Update balance
    //   response = await supamaster
    //     .from("engineers")
    //     .update({
    //       balance_under_process: 0,
    //     })
    //     .eq("stripe_account_id", event.data.object.destination);

    //   if (response.error) {
    //     return res.status(response.status).json({ text: response.statusText });
    //   }
    //   break;
    // case "payment_intent.succeeded":
    //   // Update balance
    //   const topup = (event.data.object.amount * (1 - 0.029) - 30) / 100;
    //   response = await supamaster.rpc("topup_user_balance", {
    //     amount: topup,
    //     customer_id: event.data.object.customer! as string,
    //   });

    //   if (response.error) {
    //     return res.status(response.status).json({ text: response.statusText });
    //   }
    //   break;
    // case "customer.created":
    //   // Update balance
    //   const customer = event.data.object;

    //   response = await supamaster
    //     .from("billing")
    //     .update({ stripe_customer_id: customer.id })
    //     .eq("auth_id", customer.metadata.auth_id);

    //   if (response.error) {
    //     return res.status(response.status).json({ text: response.statusText });
    //   }
    //   break;
    default:
      break;
  }

  return res.status(200); //.json({ received: true, data: response?.data });
}
