import { Provider } from "@supabase/supabase-js";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { NEXT_PUBLIC_SITE_URL } from "../lib/env";

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  // const { data: { balance = null, freetier = null } = {} } =
  //   api.balances.getBalance.useQuery(undefined, {
  //     enabled: user !== null,
  //   });
  // const { data: { key = null } = {} } = api.keys.getKey.useQuery(undefined, {
  //   enabled: user !== null,
  // });
  // const { data: { username = null, bio = null, openai_api_key = null } = {} } =
  //   api.engineers.getMyProfile.useQuery(undefined, {
  //     enabled: user !== null,
  //   });
  const r = useRouter();

  async function signIn(
    params:
      | {
          method: "oauth";
          provider: Extract<Provider, "google" | "github" | "twitter">;
        }
      | { method: "email"; email: string }
  ) {
    if (params.method === "oauth")
      await supabase.auth.signInWithOAuth({
        provider: params.provider,
        options: {
          redirectTo: `${NEXT_PUBLIC_SITE_URL}/explore`,
        },
      });
    else
      await supabase.auth.signInWithOtp({
        email: params.email,
        options: {
          emailRedirectTo: `${NEXT_PUBLIC_SITE_URL}/explore`,
        },
      });
  }

  async function signOut() {
    await supabase.auth.signOut();
    r.reload();
  }

  return {
    signIn,
    signOut,
    user,
    // balance,
    // freetier,
    // key,
    // username,
    // bio,
    // openai_api_key,
  };
};
