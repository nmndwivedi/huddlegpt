import { z } from "zod";
import { createTRPCRouter, isAuthenticated, publicProcedure } from "../trpc";

export const promptify = createTRPCRouter({
    getTitle: publicProcedure
      .use(isAuthenticated)
      .input(z.object({message : z.string()}))
      .mutation(async ({ input, ctx }) => {
        const titleResponse = await fetch("https://api.promptify.ai/", {
            body: JSON.stringify({
              prompt_id: "86cbe53b-fad5-4eee-ab5d-982a0bbb7aa1", // Prompt id for title generator
              input: {text : `${input.message}`}
            }),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-Api-Key": "39d06281-dbb3-42d9-86a1-6c232e226152", // ipromptify@gmail.com
            },
            method: "POST",
          }).then(res => res.json());

          return titleResponse;
      }),

});