import { AppProps, type AppType } from "next/app";

import { api } from "../utils/api";

import "../styles/globals.css";
import { useInit } from "../hooks/init";
import { Session } from "@supabase/supabase-js";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider } from "next-themes";

const MyApp = ({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session;
}>) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  useInit();

  return (
    <ThemeProvider attribute="class">
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <Component {...pageProps} />
      </SessionContextProvider>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
