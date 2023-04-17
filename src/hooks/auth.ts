import { Provider, User } from "@supabase/supabase-js";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { api } from "../utils/api";
import { NEXT_PUBLIC_SITE_URL } from "../lib/env";

export const useAuth = () => {
  const supabase = useSupabaseClient();
  const utils = api.useContext();
  const user = useUser();
  const { data } = api.metadata.getMetadataForUser.useQuery(
    { userId: user?.id },
    {
      enabled: !!user,
    }
  );
  const { mutate: setMetadata } = api.metadata.setMetadata.useMutation({
    onSuccess: () => {
      utils.metadata.getMetadataForUser.invalidate({ userId: user?.id });
    },
  });
  const r = useRouter();

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
          redirectTo: `${NEXT_PUBLIC_SITE_URL}`,
        },
      });
    else
      await supabase.auth.signInWithOtp({
        email: params.email,
        options: {
          emailRedirectTo: `${NEXT_PUBLIC_SITE_URL}`,
        },
      });
  }

  async function signOut() {
    await supabase.auth.signOut();
    r.push("/");
  }

  return {
    signIn,
    signOut,
    user,
    metadata: data?.metadata || null,
    setMetadata,
    // balance,
    // freetier,
    // key,
    // username,
    // bio,
    // openai_api_key,
  };
};
