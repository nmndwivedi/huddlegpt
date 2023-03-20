import React from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import Head from "next/head";
import Topbar from "~/comp/Topbar";
import Sidebar from "~/comp/Sidebar";
import Message from "~/comp/Message";

const Chat = () => {
  const {
    query: { id },
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

  const sender = {
    type: "user" as const,
    username: "User",
    email: "user@gmail.com",
    pic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60"
  }

  const gpt = {
    type: "gpt",
    model: "GPT-3.5T",
    creativity: "low"
  } as const

  return (
    <>
      <PageHead />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-700">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 flex-col relative">
          <Topbar setSidebarOpen={setSidebarOpen} />
          <div className="top-24 absolute h-16 w-full bg-gradient-to-b from-gray-600 opacity-20 dark:from-black"></div>
          <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-black opacity-20"></div>
          <div className="w-full mt-24 pb-64 flex-1 overflow-y-scroll">
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
            <Message id="1" sender={sender} text="Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos Hellos" />
            <Message id="1" sender={gpt} text="Hellso" />
          </div>
        </div>
      </div>
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
