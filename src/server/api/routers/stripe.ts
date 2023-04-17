import { z } from "zod";
import { NEXT_PUBLIC_SITE_URL } from "../../../lib/env";
import { throwTRPCError } from "../../../lib/supabase";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
  attachStripe,
} from "../trpc";

export const stripe = createTRPCRouter({
  getOrCreateCustomer: publicProcedure
    .use(attachStripe)
    .use(isAuthenticated)
    .mutation(async ({ ctx }) => {
      const { data } = await ctx.supamaster
        .from("billing")
        .select("stripe_customer_id")
        .eq("id", ctx.user.id)
        .maybeSingle();

      if (data === null) {
        throwTRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get user data",
        });
        throw new Error();
      }

      if (data?.stripe_customer_id && data?.stripe_customer_id !== "") {
        return { stripe_id: data?.stripe_customer_id };
      }

      let customer;
      try {
        customer = await ctx.stripe.customers.create({
          email: ctx.user.email,
        });
      } catch (e) {
        throwTRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create stripe account",
        });
        throw new Error();
      }

      const { error } = await ctx.supamaster
        .from("billing")
        .update({
          stripe_customer_id: customer.id,
        })
        .eq("id", ctx.user.id)
        .is("stripe_customer_id", null);

      if (error) {
        throwTRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not update your profile. Try again later",
        });
      }

      return { stripe_id: customer.id };
    }),
  createCustomerPortalSession: publicProcedure
    .use(attachStripe)
    .use(isAuthenticated)
    .input(z.object({ stripe_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Authenticate user.
      const session = await ctx.stripe.billingPortal.sessions.create({
        customer: input.stripe_id,
        return_url: `${NEXT_PUBLIC_SITE_URL}`,
      });

      return { portal_link: session.url };
    }),
});
