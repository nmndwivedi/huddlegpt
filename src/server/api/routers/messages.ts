import { z } from "zod";

import {
  createTRPCRouter,
  isAuthenticated,
  publicProcedure,
} from "~/server/api/trpc";
import { throwTRPCError } from "../../../lib/supabase";

export const messages = createTRPCRouter({
  pushNewMessageToThread: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({
        id: z.string().uuid(),
        text: z.string().min(1),
        threadId: z.string().uuid(),
        senderAuthId: z.string().uuid().nullish(),
        parentId: z.string().uuid().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data: thread } = await ctx.supamaster
        .from("threads")
        .select("*,messages(count)")
        .eq("id", input.threadId)
        .single();

      if (!thread || thread.admin_auth_id !== ctx.user.id) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Thread Not Found",
        });
        throw new Error();
      }

      const { data, error } = await ctx.supamaster
        .from("messages")
        .insert([
          {
            id: input.id,
            text: input.text,
            thread_id: input.threadId,
            sender_auth_id: input.senderAuthId,
            created_at: new Date().toISOString(),
            parent_id: input.parentId,
          },
        ])
        .select()
        .single();

      if (!data) {
        console.log(error.message);
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Unable to Insert Message",
        });
        throw new Error();
      }

      return {
        messageId: data.id,
        // threadTitle: title,
      };
    }),
  getThreadMessages: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
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

      const { data } = await ctx.supamaster
        .from("messages")
        .select("*")
        .eq("thread_id", input.id)
        .order("created_at", { ascending: true });

      if (!data) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Messages Not Found",
        });
        throw new Error();
      }

      // Attach leftSibling, rightSibling, siblingCount, depthIndex to each message in thread and sort by date
      const modifiedData = data?.map((element, index, array) => {
        const { id, parent_id } = element;

        // Find all objects with the same parentId as the current element
        const siblings = array
          .filter((e) => e.parent_id === parent_id)
          .sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );

        // Calculate siblingCount
        const siblingCount = siblings.length;

        // Calculate siblingIndex
        const siblingIndex = siblings.findIndex((e) => e.id === id);

        // Calculate leftSiblingId
        const leftSiblingIndex = siblingIndex - 1;
        const leftSiblingId =
          leftSiblingIndex >= 0 ? siblings[leftSiblingIndex]?.id : null;

        // Calculate rightSiblingId
        const rightSiblingIndex = siblingIndex + 1;
        const rightSiblingId =
          rightSiblingIndex < siblingCount
            ? siblings[rightSiblingIndex]?.id
            : null;

        // Calculate depthIndex
        let depthIndex = 0;
        let parentId = element.parent_id;
        while (parentId !== null) {
          depthIndex++;
          parentId = array.find((o) => o?.id === parentId)?.parent_id || null;
        }

        return {
          ...element,
          indices: {
            depthIndex,
            siblingCount,
            siblingIndex,
            leftSiblingId,
            rightSiblingId,
          },
        };
      });

      return {
        messages: modifiedData,
      };
    }),
});
