import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useState } from "react";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import Head from "next/head";
import Topbar from "~/comp/Topbar";
import Sidebar from "~/comp/Sidebar";
import Chatbox from "~/comp/Chatbox";
import useStore from "~/store/store";
import Settingbar from "~/comp/Settingbar";

const Chat = () => {
  const {
    query: { id },
  } = useRouter();

  const { setSelectedChatId } = useStore();

  useEffect(() => {
    if (typeof id === "string") {
      setSelectedChatId(id);
    }
  }, [id]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  //   const [userState, setUserState] = useState<RealtimePresenceState>({});
  //   const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  // useEffect(() => {
  //   const channel = supabaseClient.channel("online-users", {
  //     config: {
  //       presence: {
  //         key: this_user?.email ? this_user?.email : "Unknown",
  //       },
  //     },
  //   });

  //   channel.on("presence", { event: "sync" }, () => {
  //     const presentState = channel.presenceState();

  //     console.log("inside presence: ", presentState);

  //     setUserState({ ...presentState });
  //   });

  //   channel.on("presence", { event: "join" }, ({ newPresences }) => {
  //     console.log("New users have joined: ", newPresences);
  //   });

  //   channel.subscribe(async (status) => {
  //     if (status === "SUBSCRIBED") {
  //       const status = await channel.track({
  //         message: Math.round(Math.random() * 1000),
  //         user_name: this_user?.email ? this_user?.email : "Unknown",
  //       });
  //       console.log("status: ", status);
  //     }
  //   });

  //   setChannel(channel);

  //   return () => {
  //     channel?.unsubscribe();
  //   };
  // }, []);

  // async function but() {
  //   const status = await channel?.track({
  //     message: Math.round(Math.random() * 1000),
  //     user_name: this_user?.email ? this_user?.email : "Unknown",
  //   });
  //   console.log("status: ", status);
  // }

  return (
    <>
      <PageHead />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-700">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col items-center w-full">
          <Topbar setSidebarOpen={setSidebarOpen} displaySettings={true} />
          <Chatbox />
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
