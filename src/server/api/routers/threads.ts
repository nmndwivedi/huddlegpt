import { z } from "zod";
import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import { throwTRPCError } from "../../../lib/supabase";
import { v4 as uuidv4 } from "uuid";
import type { ArrayElement } from "../../../lib/ts/utility";

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

      const { data: newThread, error } = await ctx.supamaster
        .from("threads")
        .update({
          prompter_link: uuidv4(),
          viewer_link: uuidv4(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.id)
        .select()
        .single();

      if (error) {
        throwTRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create or reset shareable links",
        });
        throw new Error();
      }

      const prompterLink = newThread?.prompter_link;
      const viewerLink = newThread?.viewer_link;

      return {
        prompterLink,
        viewerLink,
      };
    }),
  giveThreadAccess: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        threadId: z.string().uuid(),
        emails: z.array(z.string().email()).min(1),
        access: z.enum(["prompter", "viewer"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("*")
        .eq("id", input.threadId)
        .single();

      if (!thread || thread.admin_auth_id !== ctx.user.id) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
        });
        throw new Error();
      }

      const { data: currentAccess } = await ctx.supamaster
        .from("access")
        .select("*")
        .match({ thread_id: input.threadId })
        .select();

      let insertEmails: string[] = [],
        updateEmails: string[] = [];

      if (currentAccess) {
        /*
        iterate through input emails,
          for each, check if email already exists in db,
            if no, then add to insertEmails
            else if cur !== requested access, then add to updateEmails
        */
        input.emails.forEach((e) => {
          const found = currentAccess.find((c) => c.user_email === e);
          if (!found) insertEmails.push(e);
          else if (found.access !== input.access) updateEmails.push(e);
        });
      } else {
        insertEmails = input.emails;
      }

      if (insertEmails.length > 0) {
        const { error } = await ctx.supamaster.from("access").insert(
          insertEmails.map((e) => ({
            thread_id: input.threadId,
            user_email: e,
            access: input.access,
          }))
        );

        if (error) {
          throwTRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Could not insert",
          });
          throw new Error();
        }
      }

      const updated: string[] = [];

      if (updateEmails.length > 0) {
        updateEmails.forEach(async (email) => {
          const { error } = await ctx.supamaster
            .from("access")
            .update({ access: input.access })
            .match({ thread_id: input.threadId, user_email: email });

          if (!error) updated.push(email);
        });
      }

      return {
        thread: input.threadId,
        inserted: insertEmails,
        updated,
      };
    }),
  revokeThreadAccess: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        threadId: z.string().uuid(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("*")
        .eq("id", input.threadId)
        .single();

      if (!thread || thread.admin_auth_id !== ctx.user.id) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
        });
        throw new Error();
      }

      const { error } = await ctx.supamaster
        .from("access")
        .delete()
        .match({ thread_id: input.threadId, user_email: input.email });

      if (error) {
        throwTRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not delete",
        });
        throw new Error();
      }

      return {
        thread: input.threadId,
        deleted: input.email,
      };
    }),
  joinThreadWithLinkCode: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ linkCode: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("id,admin_auth_id")
        .eq("prompter_link", input.linkCode)
        .single();

      if (thread?.admin_auth_id === ctx.user.id) {
        return {
          threadId: thread.id,
          role: "admin" as const,
        };
      } else if (!!thread) {
        return {
          threadId: thread.id,
          role: "prompter" as const,
        };
      }

      const { data } = await ctx.supamaster
        .from("threads")
        .select("id,admin_auth_id")
        .eq("viewer_link", input.linkCode)
        .single();

      if (data?.admin_auth_id === ctx.user.id) {
        return {
          threadId: data.id,
          role: "admin" as const,
        };
      } else if (!!data) {
        return {
          threadId: data.id,
          role: "viewer" as const,
        };
      }

      throwTRPCError({
        code: "NOT_FOUND",
        message: "Thread Not Found",
      });
      throw new Error();
    }),
});
