import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import HomePage from "~/comp/HomePage";

import { api } from "~/utils/api";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>HuddleGPT - Multiplayer ChatGPT</title>
        <meta
          name="description"
          content="HuddleGPT is ChatGPT on Multiplayer Mode. Brainstorm together with your team in realtime!"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
      {/* <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-800"></main> */}
    </>
  );
};

export default Home;
