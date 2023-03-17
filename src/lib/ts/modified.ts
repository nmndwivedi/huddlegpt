/*
  There are 3 jobs of this file
  1. Manually handling typings for nested postgres selects with supabase client
  2. Manually removing sensitive properties on a type for client side
  3. Manually assigning types to jsonb objects in postgres with quicktype
*/

import { Database } from "../../schema";
import { PartialBy } from "./utility";

// export type RawPrompt = PartialBy<
//   Database["public"]["Tables"]["prompts"]["Row"] & {
//     engineers: Pick<
//       Database["public"]["Tables"]["engineers"]["Row"],
//       "username"
//     >;
//   },
//   "prompt_text" | "prompt_details"
// >;

// export type Prompt = Omit<
//   RawPrompt,
//   "prompt_text" | "prompt_details" | "inputs" | "output"
// > & {
//   inputs: Input[];
//   output: Output;
// };

// export type MasterPrompt = Omit<
//   Database["public"]["Tables"]["prompts"]["Row"] & {
//     engineers: Database["public"]["Tables"]["engineers"]["Row"];
//   },
//   "inputs" | "output" | "prompt_details"
// > & {
//   inputs: Input[];
//   output: Output;
//   prompt_details: PromptDetails;
// };

// export type RawEngineer = PartialBy<
//   Database["public"]["Tables"]["engineers"]["Row"],
//   "created_at" | "stripe_account_id" | "stripe_connect_onboarded" | "auth_id"
// >;

// export type Engineer = Omit<
//   RawEngineer,
//   "created_at" | "stripe_account_id" | "stripe_connect_onboarded" | "auth_id"
// >;

// export type Input = {
//   name: string;
//   type: "text" | "number";
//   description: string;
// };

// export type Output = {
//   type: "text" | "number";
//   description: string;
// };

// export type PromptDetails = {
//   model: string;
//   top_p: number;
//   max_tokens: number;
//   temperature: number;
//   presence_penalty: number;
//   frequency_penalty: number;
// };
