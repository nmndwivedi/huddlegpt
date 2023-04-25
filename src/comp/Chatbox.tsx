import React, { useEffect, useRef, useState } from "react";
import MessageComp from "~/comp/Message";
import { ExpandingTextarea } from "~/comp/ExpandingTextarea";
import Spinner from "~/comp/Spinner";
import { useSinglePresence } from "~/hooks/presence";
import { ModMessage } from "~/lib/ts/modified";

const Chatbox = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  let [scrollHt, setScrollHt] = useState(0);
  let [isScrolling, setIsScrolling] = useState(true);

  const [displayChain, setDisplayChain] = useState<ModMessage[]>([]);

  const {
    temporaryResponse,
    isLoading,
    isError,
    threadData,
    terminate,
    regenerate,
    sendMessage,
  } = useSinglePresence({ setIsScrolling, displayChain, setDisplayChain });

  let [cursor, setCursor] = useState("▋");

  // Cursor for visual effect
  useEffect(() => {
    const i = setInterval(() => setCursor((c) => (c === "" ? "▋" : "")), 500);

    return () => {
      if (i) clearInterval(i);
    };
  }, []);

  // Always scroll the last message into view when display chain changes
  useEffect(() => {
    if (scrollRef.current && displayChain.length > 0) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [displayChain]);

  // When reponse is streaming and user hasnt manually scrolled, always keep last line in focus
  useEffect(() => {
    if (temporaryResponse !== "" && isScrolling && scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [temporaryResponse]);

  return (
    <>
      <div
        className="w-full flex-1 overflow-y-scroll pb-64"
        onScroll={(e) => {
          const ht = (e.target as any).scrollTop;
          if (ht < scrollHt) setIsScrolling(false);
          setScrollHt(ht);
        }}
      >
        {isLoading && (
          <div className="flex h-full w-full scale-150 items-center justify-center opacity-60">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="flex h-full w-full items-center justify-center text-base font-light opacity-60">
            Something went wrong :/
          </div>
        )}

        {!isLoading && !isError && threadData && displayChain.length > 0 && (
          <>
            {displayChain.map((message, idx) => (
              <MessageComp
                key={message.id}
                message={message}
                thread={threadData.thread}
              />
            ))}
            {displayChain.length > 0 &&
              !!displayChain[displayChain.length - 1]?.sender_auth_id && (
                <>
                  <MessageComp
                    thread={threadData.thread}
                    message={{
                      id: "temp",
                      parent_id: displayChain[displayChain.length - 1]!.id,
                      created_at: new Date().toISOString(),
                      sender_auth_id: null,
                      text: temporaryResponse + cursor,
                      thread_id: threadData.thread.id,
                      indices: {
                        depthIndex: displayChain.length,
                        leftSiblingId: null,
                        rightSiblingId: null,
                        siblingCount: 0,
                        siblingIndex: -1,
                      },
                    }}
                  />
                </>
              )}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      {!isLoading &&
        !isError &&
        displayChain.length > 0 &&
        !!displayChain[displayChain.length - 1]?.sender_auth_id &&
        temporaryResponse.length > 0 && (
          <div className="absolute bottom-[120px]">
            <button
              onClick={() => terminate()}
              className="w-36 rounded-md border border-gray-400 bg-gray-100 px-4 py-2 active:opacity-60 dark:bg-gray-600"
            >
              Stop ✋
            </button>
          </div>
        )}

      {!isLoading &&
        !isError &&
        displayChain.length > 0 &&
        !displayChain[displayChain.length - 1]?.sender_auth_id && (
          <div className="absolute bottom-[120px]">
            <button
              onClick={() => regenerate()}
              className="w-36 rounded-md border border-gray-400 bg-gray-100 px-4 py-2 active:opacity-60 dark:bg-gray-600"
            >
              Regenerate 🔁
            </button>
          </div>
        )}

      <ExpandingTextarea callback={sendMessage} maxRows={12} />
    </>
  );
};

export default Chatbox;
