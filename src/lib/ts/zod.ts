import { z } from "zod";

export const createPromptSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10).max(4000),
  tags: z.array(z.string()).max(5),
  prompt: z.string().min(10),
  inputs: z.array(
    z.object({
      name: z.string().min(1),
      type: z.enum(["number", "text"]),
      description: z.string().max(5000),
    })
  ),
  output: z.object({
    type: z.enum(["number", "text"]),
    description: z.string().max(5000),
  }),
  maxtokens: z.preprocess(Number, z.number().min(10).max(4000)),
  temperature: z.preprocess(Number, z.number().min(0).max(1)),
  topp: z.preprocess(Number, z.number().min(0).max(1)),
  frequency: z.preprocess(Number, z.number().min(0).max(2)),
  presence: z.preprocess(Number, z.number().min(0).max(2)),
  price: z.preprocess(Number, z.number().min(0).max(10)),
  model: z.string().min(1),
});

export const getPromptsSchema = z.object({
  tags: z.array(z.string()).nullish(),
  orderBy: z.enum(["Popular", "Date", "PriceLTH", "PriceHTL"]).nullish(),
  page: z.number(),
});
