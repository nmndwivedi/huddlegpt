import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { throwTRPCError } from "../../../lib/supabase";

export const threads = createTRPCRouter({
    getThread: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input, ctx }) => {
        const { data } = await ctx.supamaster
          .from("threads")
          .select("*")
          .eq("id", input.id)
          .maybeSingle();
  
        if (!data)
          throwTRPCError({
            code: "NOT_FOUND",
            message: "Thread Not Found",
          });
  
        return {
          thread: data,
        };
      }),
    getUserThreads: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input, ctx }) => {
        const { data } = await ctx.supamaster
          .from("threads")
          .select("*")
          .eq("admin_auth_id", input.id);
  
        if (!data)
          throwTRPCError({
            code: "NOT_FOUND",
            message: "Threads Not Found",
          });
  
        return {
          threads: data,
        };
      }),
    
  });
  