import React from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import Head from "next/head";
import Sidebar from "~/comp/Sidebar";
import Main from "~/comp/Topbar";
import { useAuth } from "~/hooks/auth";
import { api } from "~/utils/api";

const Chat = () => {
  const {
    query: { code },
  } = useRouter();

  return (
    <>
      <PageHead />
      <p className="whitespace-pre-wrap">
        {/* {JSON.stringify(userState, null, 2)} */}
      </p>
      {/* <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Main setSidebarOpen={setSidebarOpen} /> */}
    </>
  );
};

function PageHead() {
  return (
    <Head>
      <title>{`HuddleGPT - Multiplayer ChatGPT`}</title>
      <meta
        name="description"
        content="HuddleGPT is ChatGPT on Multiplayer Mode. Brainstorm together with your team in realtime!"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default Chat;
