import React from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import Head from "next/head";
import Sidebar from "~/comp/Sidebar";
import Main from "~/comp/Topbar";

const Chat = () => {
  const {
    query: { code },
  } = useRouter();

  const supabaseClient = useSupabaseClient();
  const this_user = { email: "hellomail@gmail" };
  const [userState, setUserState] = useState<RealtimePresenceState>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabaseClient.channel("online-users", {
      config: {
        presence: {
          key: this_user?.email ? this_user?.email : "Unknown",
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      const presentState = channel.presenceState();

      console.log("inside presence: ", presentState);

      setUserState({ ...presentState });
    });

    channel.on("presence", { event: "join" }, ({ newPresences }) => {
      console.log("New users have joined: ", newPresences);
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const status = await channel.track({
          message: Math.round(Math.random() * 1000),
          user_name: this_user?.email ? this_user?.email : "Unknown",
        });
        console.log("status: ", status);
      }
    });

    setChannel(channel);

    return () => {
      channel?.unsubscribe();
    };
  }, []);

  async function but() {
    const status = await channel?.track({
      message: Math.round(Math.random() * 1000),
      user_name: this_user?.email ? this_user?.email : "Unknown",
    });
    console.log("status: ", status);
  }

  return (
    <>
      <PageHead />
      <p className="whitespace-pre-wrap">
        {JSON.stringify(userState, null, 2)}
      </p>
      <button onClick={but}>send</button>
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
