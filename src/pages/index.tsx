import { type NextPage } from "next";
import Head from "next/head";
import Topbar from "~/comp/Topbar";
import { useState } from "react";
import Sidebar from "~/comp/Sidebar";
import Message from "~/comp/Message";
import { ExpandingTextarea } from "~/comp/ExpandingTextarea";

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <div className="flex flex-1 flex-col items-center relative">
          <Topbar setSidebarOpen={setSidebarOpen} />
          <div className="top-24 absolute h-16 w-full bg-gradient-to-b from-gray-600 opacity-20 dark:from-black"></div>
          <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-black opacity-60"></div>
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
          <ExpandingTextarea maxRows={12} />
        </div>
      </div>
    </>
  );
};

function PageHead() {
  return (
    <Head>
      <title>HuddleGPT - Multiplayer ChatGPT</title>
      <meta
        name="description"
        content="HuddleGPT is ChatGPT on Multiplayer Mode. Brainstorm together with your team in realtime!"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}

export default Home;
