import React, { useEffect, useRef, useState } from "react";
import MessageComp from "~/comp/Message";
import { ExpandingTextarea } from "~/comp/ExpandingTextarea";
import { api } from "~/utils/api";
import Spinner from "~/comp/Spinner";
import { useAuth } from "~/hooks/auth";
import useStore from "~/store/store";
import { v4 as uuidv4 } from "uuid";
// @ts-ignore
import { SSE } from "sse";
import { ModMessage } from "~/lib/ts/modified";

const Chatbox = () => {
  const utils = api.useContext();
  const { user } = useAuth();

  const lastItemRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const { selectedChatId } = useStore();
  const [displayChain, setDisplayChain] = useState<ModMessage[]>([]);

  let [sseSource, setSseSource] = useState<any>(null);
  let [scrollHt, setScrollHt] = useState(0);
  let [isScrolling, setIsScrolling] = useState(true);

  let [temporaryResponse, setTemporaryResponse] = useState("");
  let [cursor, setCursor] = useState("▌");

  const { mutateAsync: setThreadTitle } =
    api.openai.setThreadTitle.useMutation();

  const {
    data: threadData,
    isLoading: isLoadingThread,
    isError: isErrorThread,
  } = api.threads.getThread.useQuery(
    { id: selectedChatId! },
    {
      enabled: !!selectedChatId,
    }
  );

  const {
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
    data: threadMessagesData,
  } = api.messages.getThreadMessages.useQuery(
    { id: threadData?.thread.id || "" },
    {
      enabled: !!threadData?.thread.id,
      onSuccess: async (data) => {
        // if (
        //   data.messages[data.messages.length - 1]?.sender_auth_id &&
        //   threadData?.thread.id
        // ) {
        //   // Execute Prompt
        // }
      },
    }
  );

  let handleSubmitPrompt = async () => {
    if (
      displayChain.length === 0 ||
      !displayChain[displayChain.length - 1]?.sender_auth_id
    )
      return;

    setIsScrolling(true);
    setTemporaryResponse("");
    let resp = "";
    let url = "https://huddle.promptify.workers.dev/";

    let limit = 4096;
    switch (threadData?.thread.model) {
      case "GPT3.5T":
        limit = 4096;
        break;
      case "GPT4":
        limit = 8192;
        break;
      case "GPT432K":
        limit = 32768;
        break;
      default:
        break;
    }
    limit *= 0.75;

    const promptHistory = displayChain
      .reduceRight((acc, c) => {
        // Starting from last, if prompt is LTE 50% of the allowed limit for model, we keep adding it to acc
        const totalWords = acc.reduce(
          (total, el) => total + el.text.split(" ").length,
          c.text.split(" ").length
        );

        return totalWords <= limit / 2 ? [...acc, c] : acc;
      }, [] as ModMessage[])
      .reverse()
      .map((msg) => ({
        role: !!msg.sender_auth_id ? "user" : "assistant",
        content: msg.text,
      }));

    let body = {
      model: "gpt-3.5-turbo",
      temperature: threadData?.thread.creativity || 1,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a ${threadData?.thread.role || "assistant"}`,
        },
        ...promptHistory,
      ],
    };

    let source = new SSE(url, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      payload: JSON.stringify(body),
    });

    source.addEventListener("message", (e: any) => {
      if (e.data !== "[DONE]") {
        let payload = JSON.parse(e.data);
        let text = payload.choices[0].delta.content;
        if (!!text) {
          setTemporaryResponse((t) => t + text);
          resp += text;
        }
      } else {
        source.close();
        const lastMsg = displayChain[displayChain.length - 1];

        if (threadData?.thread.id && lastMsg && !!lastMsg.sender_auth_id) {
          pushMessageToThread({
            id: uuidv4(),
            parentId: lastMsg.id,
            senderAuthId: null,
            text: resp,
            threadId: threadData?.thread.id,
          });
        }
      }
    });

    source.addEventListener("readystatechange", (e: any) => {
      if (e.readyState >= 2) {
        setSseSource(null);
      }
    });

    setSseSource(source);

    source.stream();
  };

  const { mutate: pushMessageToThread } =
    api.messages.pushNewMessageToThread.useMutation({
      onMutate: async (newTodo) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        utils.messages.getThreadMessages.cancel({
          id: threadData!.thread.id,
        });

        // Snapshot the previous value
        const previousTodos = utils.messages.getThreadMessages.getData({
          id: threadData!.thread.id,
        });

        // Find all objects with the same parentId as the current element
        const siblings =
          previousTodos?.messages
            .filter((e) => e.parent_id === newTodo.parentId)
            .sort(
              (a, b) =>
                new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
            ) || [];

        // Calculate siblingCount
        const siblingCount = siblings.length;

        // Calculate siblingIndex
        const siblingIndex = siblings.findIndex((e) => e.id === newTodo.id);

        // Calculate leftSiblingId
        const leftSiblingIndex = siblingIndex - 1;
        const leftSiblingId =
          leftSiblingIndex >= 0 ? siblings[leftSiblingIndex]?.id : null;

        // Calculate rightSiblingId
        const rightSiblingIndex = siblingIndex + 1;
        const rightSiblingId =
          rightSiblingIndex < siblingCount
            ? siblings[rightSiblingIndex]?.id
            : null;

        // Calculate depthIndex
        let depthIndex = 0;
        let parentId: string | null = newTodo.parentId || null;
        while (parentId !== null) {
          depthIndex++;
          parentId =
            previousTodos?.messages.find((o) => o?.id === parentId)
              ?.parent_id || null;
        }

        const messages = [
          ...(previousTodos?.messages || []),
          {
            id: newTodo.id,
            created_at: new Date().toISOString(),
            sender_auth_id: newTodo.senderAuthId || null,
            text: newTodo.text,
            thread_id: newTodo.threadId,
            parent_id: newTodo.parentId || null,
            indices: {
              depthIndex,
              siblingCount,
              siblingIndex,
              leftSiblingId,
              rightSiblingId,
            },
          },
        ];

        // Optimistically update to the new value
        utils.messages.getThreadMessages.setData(
          { id: threadData!.thread.id },
          {
            messages,
          }
        );

        setTemporaryResponse("");

        // Pretend execute prompt

        // Return a context with the previous and new todo
        return { previousTodos, newTodo };
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newTodo, context) => {
        const messages = context?.previousTodos?.messages || [];

        utils.messages.getThreadMessages.setData(
          { id: threadData!.thread.id },
          { messages }
        );
      },
      // Always refetch after error or success:
      onSettled: () => {
        utils.messages.getThreadMessages.invalidate({
          id: threadData!.thread.id,
        });
      },
      onSuccess(data, variables, context) {
        // execute prompt

        if (context?.newTodo.text && !!context.newTodo.senderAuthId) {
          handleSubmitPrompt();
        }
      },
    });

  function findMessageChainUptoIcluding(id: string): ModMessage[] {
    const message = threadMessagesData?.messages.find((m) => m.id === id);

    if (!message) {
      return []; // message with the given id not found
    }

    if (!message.parent_id) {
      return [message]; // message has no parent, return itself
    }

    const parentMessage = threadMessagesData?.messages.find(
      (m) => m.id === message.parent_id
    );

    if (!parentMessage) {
      return [message]; // parent message not found, return itself
    }

    const parentChain = findMessageChainUptoIcluding(parentMessage.id);

    return parentChain ? [...parentChain, message] : [message];
  }

  function findMessageChainAfter(id: string): ModMessage[] {
    if (!threadMessagesData) return [];

    const latestMessage = threadMessagesData.messages.find(
      (message) => message.id === id
    );

    if (!latestMessage) {
      return [];
    }

    const childMessages = threadMessagesData.messages.filter(
      (message) => message.parent_id === id
    );

    if (childMessages.length === 0) return [];

    let latestChildMessage = childMessages[0];

    childMessages.forEach((child) => {
      if (
        new Date(child.created_at).getTime() >
        new Date(latestChildMessage!.created_at).getTime()
      )
        latestChildMessage = child;
    });

    return [latestMessage, ...findMessageChainAfter(latestChildMessage!.id)];
  }

  function findMessageChain(id: string) {
    return [...findMessageChainUptoIcluding(id), ...findMessageChainAfter(id)];
  }

  useEffect(() => {
    async function e() {
      if (
        !selectedChatId ||
        !threadData?.thread?.id ||
        !threadMessagesData?.messages
      )
        return;

      setDisplayChain(
        findMessageChain(
          threadMessagesData.messages[threadMessagesData.messages.length - 1]!
            .id
        )
      );

      if (
        !threadData?.thread?.title &&
        threadMessagesData.messages.length > 0 &&
        !!threadMessagesData.messages[0]?.text
      ) {
        const { title } = await setThreadTitle({
          threadId: threadData?.thread?.id,
          message: threadMessagesData.messages[0]?.text,
        });

        if (!title) return;

        utils.threads.getThread.invalidate({ id: selectedChatId });
        utils.threads.getUserThreads.invalidate();

        const eventData = {
          id: threadData?.thread?.id,
          title,
        };

        const customEvent = new CustomEvent("title-set", {
          detail: eventData,
        });

        document.dispatchEvent(customEvent);
      }
    }

    e();
  }, [threadMessagesData, threadData]);

  useEffect(() => {
    const i = setInterval(() => setCursor((c) => (c === "" ? "▌" : "")), 500);

    handleSubmitPrompt();

    return () => {
      if (i) clearInterval(i);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current && displayChain.length > 0) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [displayChain]);

  useEffect(() => {
    if (temporaryResponse !== "" && isScrolling && scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [temporaryResponse]);

  //TODO multi senders
  async function sendMessage(text: string) {
    if (!user?.id || !threadData?.thread.id) return false;

    const lastId = displayChain[displayChain.length - 1]?.id;

    if (lastId) {
      pushMessageToThread({
        id: uuidv4(),
        senderAuthId: user?.id,
        text: text,
        threadId: threadData?.thread.id,
        parentId: lastId,
      });
    }

    return true;
  }

  function terminate() {
    //close source, set msg data optimistically
    sseSource?.close();
    const lastMsg = displayChain[displayChain.length - 1];

    if (threadData?.thread.id && lastMsg && !!lastMsg.sender_auth_id) {
      pushMessageToThread({
        id: uuidv4(),
        parentId: lastMsg.id,
        senderAuthId: null,
        text: temporaryResponse,
        threadId: threadData?.thread.id,
      });
    }
  }

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
        {(isLoadingThread || isLoadingMessages) && (
          <div className="flex h-full w-full scale-150 items-center justify-center opacity-60">
            <Spinner />
          </div>
        )}

        {(isErrorThread || isErrorMessages) && (
          <div className="flex h-full w-full scale-150 items-center justify-center text-base font-light opacity-60">
            Something went wrong :/
          </div>
        )}

        {!isLoadingThread &&
          !isLoadingMessages &&
          !isErrorThread &&
          !isErrorMessages &&
          displayChain.length > 0 && (
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

      {displayChain.length > 0 &&
        !!displayChain[displayChain.length - 1]?.sender_auth_id &&
        temporaryResponse.length > 0 && (
          <div className="absolute bottom-32">
            <button
              onClick={terminate}
              className="w-32 rounded-md border border-gray-400 bg-gray-600 px-4 py-2 active:border-opacity-50"
            >
              Stop ✋
            </button>
          </div>
        )}

      <ExpandingTextarea callback={sendMessage} maxRows={12} />
    </>
  );
};

export default Chatbox;
