import { z } from "zod";
import {
  NEXT_PUBLIC_SITE_URL,
} from "../../../lib/env";
import { throwTRPCError } from "../../../lib/supabase";
import { createTRPCRouter, isAuthenticated, publicProcedure, attachStripe } from "../trpc";

export const stripe = createTRPCRouter({
    createConnectedAccount: publicProcedure
      .use(attachStripe)
      .use(isAuthenticated)
      .mutation(async ({ ctx }) => {
        const { data } = await ctx.supabase
          .from("users")
          .select("stripe_customer_id")
          .eq("auth_id", ctx.user.id)
          .maybeSingle();
  
        if (data?.stripe_customer_id && data?.stripe_customer_id !== "") {
          return {account_id : data?.stripe_customer_id}
        }
  
        let account
        try {
          account = await ctx.stripe.accounts.create({type: 'express'});
        } catch (e) {
          throwTRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create stripe account",
          });
          throw new Error();
        }
  
        const { error } = await ctx.supabase
          .from("users")
          .update({
            stripe_customer_id: account.id
          })
          .eq("auth_id", ctx.user.id)
          .is("stripe_customer_id", null);
  
        if (error) {
          throwTRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not update your profile. Try again later",
          });
        }
  
        return {account_id : account.id}
    }),
    createCustomerPortalSession: publicProcedure
      .use(attachStripe)
      .use(isAuthenticated)
      .input(z.object({account_id : z.string()}))
      .mutation(async ({ input, ctx }) => {
        
        // Authenticate user.
        const session = await ctx.stripe.billingPortal.sessions.create({
            customer: input.account_id,
            return_url: `${NEXT_PUBLIC_SITE_URL}`,
        });

        return {portal_link : session.url}
      }),
  });