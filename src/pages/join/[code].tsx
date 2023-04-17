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

  const supabaseClient = useSupabaseClient();

  const { user } = useAuth();

  const {
    data: thread,
    isLoading,
    isError,
  } = api.threads.getThreadIdFromLinkCode.useQuery(
    { linkCode: code as string },
    { enabled: !!code }
  );

  const [userState, setUserState] = useState<RealtimePresenceState>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pchannel, setPChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!user || !thread) return;

    const channel = supabaseClient.channel(thread.id);

    channel
      .on("broadcast", { event: "supa" }, (payload) => console.log(payload))
      .subscribe();

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        channel.send({
          type: "broadcast",
          event: "supa",
          payload: { org: "supabase" },
        });
      }
    });

    // channel.on("presence", { event: "sync" }, () => {
    //   setUserState({ ...channel.presenceState() });
    // });

    // channel.subscribe(async (status) => {
    //   if (status === "SUBSCRIBED") {
    //     await channel.track({
    //       message: Math.round(Math.random() * 1000),
    //       userId: user?.id,
    //       access: thread?.access,
    //     });
    //   }
    // });

    setPChannel(channel);

    return () => {
      channel?.unsubscribe();
    };
  }, [user, thread]);

  async function buttonHandle() {
    await pchannel?.track({
      message: Math.round(Math.random() * 1000),
      userId: user?.id,
      access: thread?.access,
    });
  }

  return (
    <>
      <PageHead />
      <p className="whitespace-pre-wrap">
        {JSON.stringify(userState, null, 2)}
      </p>
      <button onClick={buttonHandle}>send</button>
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
