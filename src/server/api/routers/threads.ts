import { z } from "zod";

import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import { throwTRPCError } from "../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";

export const threads = createTRPCRouter({
  generateNewThreadWithMessage: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.string().uuid(),
        model: z.string().min(1),
        creativity: z.number().min(0).max(1),
        role: z.string().min(1),
        msgId: z.string().uuid(),
        text: z.string().min(1).nullish(),
        username: z.string().min(1).nullish(),
        avatar: z.string().min(1).nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data } = await ctx.supamaster
        .from("threads")
        .insert({
          id: input.id,
          admin_auth_id: ctx.user.id,
          model: input.model,
          creativity: input.creativity,
          role: input.role,
        })
        .select()
        .single();

      if (!data) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
        });
        throw new Error();
      }

      if (input.text) {
        const { data: message } = await ctx.supamaster
          .from("messages")
          .insert({
            id: input.msgId,
            text: input.text,
            thread_id: data.id,
            sender_auth_id: ctx.user.id,
            username: input.username,
            avatar: input.avatar,
          })
          .select()
          .single();

        if (!message) {
          throwTRPCError({
            code: "NOT_FOUND",
            message: "Thread Not Found",
          });
          throw new Error();
        }
      }

      return {
        threadId: data.id,
      };
    }),
  getThread: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data } = await ctx.supamaster
        .from("threads")
        .select("*")
        .eq("id", input.id)
        .maybeSingle();

      if (!data || data.admin_auth_id !== ctx.user.id) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
        });
        throw new Error();
      }

      return {
        thread: data,
      };
    }),
  getUserThreads: publicProcedure
    .use(isAuthenticated)
    .query(async ({ ctx }) => {
      const { data } = await ctx.supamaster
        .from("threads")
        .select("*,messages(count)")
        .eq("admin_auth_id", ctx.user.id)
        .order("created_at", { ascending: false });

      if (!data) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Threads Not Found",
        });
      }

      return {
        threads: data?.filter((d) => (d.messages as any)[0]?.count > 0),
      };
    }),
  getShareableLinkForThread: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("*")
        .eq("id", input.id)
        .single();

      if (!thread || thread.admin_auth_id !== ctx.user.id) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
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
  getThreadIdFromLinkCode: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ linkCode: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("id,admin_auth_id")
        .eq("prompter_link", input.linkCode)
        .single();

      if (!!thread) {
        return {
          id: thread.id,
          admin: thread.admin_auth_id,
          access: "prompter",
        };
      }

      const { data } = await ctx.supamaster
        .from("threads")
        .select("id,admin_auth_id")
        .eq("viewer_link", input.linkCode)
        .single();

      if (!!data) {
        return {
          id: data.id,
          admin: data.admin_auth_id,
          access: "viewer",
        };
      }

      throwTRPCError({
        code: "NOT_FOUND",
        message: "Thread Not Found",
      });
      throw new Error();
    }),
});
