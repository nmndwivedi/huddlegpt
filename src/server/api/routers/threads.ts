import { z } from "zod";

import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import { throwTRPCError } from "../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

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
  generateNewThread: publicProcedure
    .use(isAuthenticated)
    .mutation(async ({ ctx }) => {
      const { data } = await ctx.supamaster
        .from("threads")
        .insert({ admin_auth_id: ctx.user.id })
        .select()
        .single();

      if (!data) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
        });
        throw new Error();
      }

      return {
        threadId: data.id,
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
  getShareableLinkForThread: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("*")
        .eq("id", input.id)
        .single();

      if (!thread) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Threads Not Found",
        });
        throw new Error();
      }

      if (
        thread.prompter_link &&
        (new Date().valueOf() - new Date(thread.updated_at).valueOf()) /
          3600000 <
          2
      ) {
        return {
          prompterLink: thread.prompter_link,
          viewerLink: thread.viewer_link!,
        };
      }

      const { data: newThread } = await ctx.supamaster
        .from("threads")
        .update({
          prompter_link: uuidv4(),
          viewer_link: uuidv4(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .select()
        .single();

      const prompterLink = newThread?.prompter_link;
      const viewerLink = newThread?.viewer_link;

      return {
        prompterLink,
        viewerLink,
      };
    }),
});
