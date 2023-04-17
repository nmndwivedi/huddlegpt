import { z } from "zod";
import { throwTRPCError } from "~/lib/supabase";
import { createTRPCRouter, isAuthenticated, publicProcedure } from "../trpc";

export const metadata = createTRPCRouter({
  getMetadataForUser: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ userId: z.string().uuid().nullish() }))
    .query(async ({ input, ctx }) => {
      const { data, error } = await ctx.supamaster
        .from("metadata")
        .select("*")
        .eq("id", input.userId || ctx.user.id)
        .maybeSingle();

      if (error) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Metadata Not Found",
        });
        throw new Error();
      }

      return {
        metadata: data,
      };
    }),
  setMetadata: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({ username: z.string().min(1), avatar: z.string().nullish() })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supamaster
        .from("metadata")
        .upsert({
          id: ctx.user.id,
          username: input.username,
          ...(input.avatar && { avatar: input.avatar }),
        })
        .eq("id", ctx.user.id)
        .maybeSingle();

      if (error) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Metadata Not Found",
        });
        throw new Error();
      }

      return {
        metadata: data,
      };
    }),
});
