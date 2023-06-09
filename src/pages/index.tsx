import { type NextPage } from "next";
import Head from "next/head";
import Topbar from "~/comp/Topbar";
import { useEffect, useState } from "react";
import Sidebar from "~/comp/Sidebar";
import LoginModal from "~/comp/LoginModal";
import Startbox from "~/comp/Startbox";
import useStore from "~/store/store";
import Chatbox from "~/comp/Chatbox";
import Settingbar from "~/comp/Settingbar";

const Home: NextPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { selectedChatId, setSelectedChatId } = useStore();

  useEffect(() => {
    setSelectedChatId(null);
  }, []);

  return (
    <>
      <PageHead />
      <div className="flex h-screen bg-gray-100 dark:bg-gray-700">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col items-center">
          <Topbar setSidebarOpen={setSidebarOpen} displaySettings={false} />

          {!selectedChatId ? (
            <Startbox setModalOpen={setModalOpen} />
          ) : (
            <Chatbox />
          )}
        </div>
      </div>
      <LoginModal open={modalOpen} setOpen={setModalOpen} />
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
