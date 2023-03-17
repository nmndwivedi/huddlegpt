import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { throwTRPCError } from "../../../lib/supabase";

export const messages = createTRPCRouter({
    getThreadMessages: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input, ctx }) => {
        const { data } = await ctx.supamaster
          .from("messages")
          .select("*")
          .eq("thread_id", input.id);
  
        if (!data)
          throwTRPCError({
            code: "NOT_FOUND",
            message: "Messages Not Found",
          });
  
        return {
            messages: data,
        };
      }),
    
  });
  