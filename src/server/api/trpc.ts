/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 *
 */
import { supamaster } from "../../lib/supabase";
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { User } from "@supabase/auth-helpers-nextjs";

import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../../lib/env";

/**
 * Replace this with an object if you want to pass things to createContextInner
 */
interface CreateContextOptions {
  user?: User | null;
}

/**
 * This helper generates the "internals" for a tRPC context. If you need to use
 * it, you can export it from here
 *
 * Examples of things you may need it for:
 * - testing, so we dont have to mock Next.js' req/res
 * - trpc's `createSSGHelpers` where we don't have req/res
 * @see https://create.t3.gg/en/usage/trpc#-servertrpccontextts
 */
const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    supamaster,
    user: _opts.user,
  };
};

/**
 * This is the actual context you'll use in your router. It will be used to
 * process every request that goes through your tRPC endpoint
 * @see https://trpc.io/docs/context
 */
export const createTRPCContext = async ({
  req,
}: FetchCreateContextFnOptions) => {
  // Create authenticated Supabase Client
  let cookie: string | null | undefined = req.headers.get("cookie");
  let user: User | null = null;

  if (cookie) {
    cookie = decodeURIComponent(cookie);
    cookie = cookie.split("supabase-auth-token=")[1];
    if (cookie) cookie = JSON.parse(cookie);
    cookie = cookie?.[0];

    const { data } = await supamaster.auth.getUser(cookie);
    user = data.user;
  }

  return createInnerTRPCContext({
    user,
  });
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

export const isAuthenticated = t.middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const attachStripe = t.middleware(async ({ ctx, next }) => {
  const stripe = new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: "2022-11-15",
  });

  return next({ ctx: { ...ctx, stripe } });
});
