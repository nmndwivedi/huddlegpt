import { z } from "zod";
import { throwTRPCError } from "~/lib/supabase";
import { createTRPCRouter, isAuthenticated, publicProcedure } from "../trpc";
import { OPEN_AI } from "~/lib/env";

export const openai = createTRPCRouter({
  setThreadTitle: publicProcedure
    .use(isAuthenticated)
    .input(
      z.object({ threadId: z.string().uuid(), message: z.string().min(1) })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPEN_AI,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "user",
                content: `Make a very short title of this text.\n\n"""${input.message}"""`,
              },
            ],
            temperature: 1,
            user: ctx.user.id,
          }),
        }
      )
        .then((res) => res.json())
        .catch((e) => {
          throwTRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "External service failure",
          });
          throw new Error();
        });

      const title = response.choices[0].message.content;

      await ctx.supamaster
        .from("threads")
        .update({
          title,
        })
        .match({ id: input.threadId, admin_auth_id: ctx.user.id });

      return { title };
    }),

  /**
      thread: {
    admin_auth_id: string;
    created_at: string | null;
    creativity: number;
    id: string;
    model: string;
    prompter_link: string | null;
    role: string;
    title: string | null;
    updated_at: string;
    viewer_link: string | null;
}
     */
  promptThread: publicProcedure
    .use(isAuthenticated)
    .input(z.object({ threadId: z.string().uuid() }))
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

      const { data: messages } = await ctx.supamaster
        .from("messages")
        .select("text,sender_auth_id")
        .eq("thread_id", input.threadId)
        .order("created_at", { ascending: false });

      if (!messages) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Messages Not Found",
        });
        throw new Error();
      }

      if (!messages[messages.length - 1]?.sender_auth_id) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "User input must directly precede prompt",
        });
        throw new Error();
      }

      //TODO reduce
      const messagesInPrompt = messages.map((m) => ({
        role: m.sender_auth_id ? "user" : "assistant",
        content: m.text,
      }));

      messagesInPrompt.push({
        role: "system",
        content: `You are a ${thread.role}`,
      });

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + OPEN_AI,
          },
          body: JSON.stringify({
            //TODO fix
            model: "gpt-3.5-turbo",
            messages: messagesInPrompt,
            temperature: thread.creativity * 2,
            user: ctx.user.id,
          }),
        }
      )
        .then((res) => res.json())
        .catch((e) => {
          throwTRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "External service failure",
          });
          throw new Error();
        });

      const text = response.choices[0].message.content;

      const { error } = await ctx.supamaster
        .from("messages")
        .insert({ thread_id: input.threadId, text });

      if (error) {
        throwTRPCError({
          code: "NOT_FOUND",
          message: "Couldnt insert message",
        });
        throw new Error();
      }

      return { response: text };
    }),
});
