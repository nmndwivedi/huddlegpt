import {
  createClient,
  PostgrestError,
  // PostgrestMaybeSingleResponse,
  // PostgrestResponse,
} from "@supabase/supabase-js";
import { TRPCError } from "@trpc/server";
import {
  NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
} from "../lib/env";
import { Database } from "../schema";

export const supamaster = createClient<Database>(
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SERVICE_KEY || NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export function throwTRPCError({
  error,
  code,
  message,
}: {
  error?: PostgrestError;
  code?:
    | "PARSE_ERROR"
    | "BAD_REQUEST"
    | "INTERNAL_SERVER_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "METHOD_NOT_SUPPORTED"
    | "TIMEOUT"
    | "CONFLICT"
    | "PRECONDITION_FAILED"
    | "PAYLOAD_TOO_LARGE"
    | "TOO_MANY_REQUESTS"
    | "CLIENT_CLOSED_REQUEST";
  message?: string;
}) {
  throw new TRPCError({
    code: code ?? "INTERNAL_SERVER_ERROR",
    message: message ?? error?.message,
    // optional: pass the original error to retain stack trace
    cause: error?.details,
  });
}

// type Supa<T> =
//   | { data: null; count: null; status: number; statusText: string }
//   | { data: T[]; count: number | null; status: number; statusText: string };

// export const handleSupabaseArrayTRPCError = <T>({
//   error,
//   ...rest
// }: PostgrestResponse<T>): Supa<T> => {
//   if (error) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: error?.message,
//       // optional: pass the original error to retain stack trace
//       cause: error?.details,
//     });
//   }

//   return rest;
// };

// type SupaSingle<T> =
//   | { data: null; count: null; status: number; statusText: string }
//   | {
//       data: T | null;
//       count: number | null;
//       status: number;
//       statusText: string;
//     };

// export const handleSupabaseMaybeSingleTRPCError = <T>({
//   error,
//   ...rest
// }: PostgrestMaybeSingleResponse<T>): SupaSingle<T> => {
//   if (error) {
//     throw new TRPCError({
//       code: "INTERNAL_SERVER_ERROR",
//       message: error?.message,
//       // optional: pass the original error to retain stack trace
//       cause: error?.details,
//     });
//   }

//   return rest;
// };
