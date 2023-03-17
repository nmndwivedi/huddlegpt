// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { STRIPE_SECRET_KEY, WEBHOOK_SECRET } from "../../../lib/env";
import { supamaster } from "../../../lib/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Only POST requests allowed" });

  if (req.query.WEBHOOK_SECRET !== WEBHOOK_SECRET)
    return res.status(401).json({ message: "Not authorized" });

  switch (req.query.TRIGGER_PROCESS) {
    case "create-stripe-customer":
      const stripe = require("stripe")(STRIPE_SECRET_KEY);

      const customer = await stripe.customers.create({
        email: req.body.record.email,
        metadata: { auth_id: req.body.record.id },
      });

      return res
        .status(200)
        .json({ message: `Stripe customer created. ID:${customer.id}` });
    default:
      return res.status(200).json({ message: `OK` });
  }
}
