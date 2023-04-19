import { useSupabaseClient } from "@supabase/auth-helpers-react";
import type {
  RealtimeChannel,
  RealtimePresenceState,
} from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useAuth } from "./auth";
import { api } from "~/utils/api";
import { ModMessage } from "~/lib/ts/modified";
import { v4 as uuidv4 } from "uuid";
import useStore from "~/store/store";
// @ts-ignore
import { SSE } from "sse";

type PresenceInputs =
  | {
      type: "code";
      code: string;
    }
  | {
      type: "admin";
      threadId: string;
    }
  | null;

export const usePresence = (input: PresenceInputs) => {
  if (!input) return null;

  return {
    ...(input.type === "code"
      ? useAttendeePresence({ code: input.code })
      : useAdminPresence({ threadId: input.threadId })),
  };
};

const useAttendeePresence = ({ code }: { code: string }) => {
  const supabaseClient = useSupabaseClient();

  const [userState, setUserState] = useState<RealtimePresenceState>({});
  const [pchannel, setPChannel] = useState<RealtimeChannel | null>(null);

  const { user } = useAuth();

  //   const { data: thread } = api.threads.getThreadIdFromLinkCode.useQuery({
  //     linkCode: code,
  //   });

  //   useEffect(() => {
  //     if (!user || !thread) return;

  //     const channel = supabaseClient.channel(thread.id, {
  //       config: {
  //         presence: {
  //           key: user.id,
  //         },
  //       },
  //     });

  //     channel.on("presence", { event: "sync" }, () => {
  //       setUserState({ ...channel.presenceState() });
  //     });

  //     channel.subscribe(async (status) => {
  //       if (status === "SUBSCRIBED") {
  //         await channel.track({
  //           userId: user.id,
  //           access: thread.access,
  //           typing: false,
  //         });
  //       }
  //     });

  //     setPChannel(channel);

  //     return () => {
  //       channel?.unsubscribe();
  //     };
  //   }, [user, thread]);

  return {
    type: "attendee" as const,
  };
};

const useAdminPresence = ({ threadId }: { threadId: string }) => {
  const supabaseClient = useSupabaseClient();

  const [userState, setUserState] = useState<RealtimePresenceState>({});
  const [pchannel, setPChannel] = useState<RealtimeChannel | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !threadId) return;

    const channel = supabaseClient.channel(threadId, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel.on("presence", { event: "sync" }, () => {
      setUserState({ ...channel.presenceState() });
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          userId: user.id,
          access: "admin",
          streaming: false,
          typing: false,
          //   messages,
          //   thread,
        });
      }
    });

    setPChannel(channel);

    return () => {
      channel?.unsubscribe();
    };
  }, [user, threadId]);

  return {
    type: "admin" as const,
    abc: "def",
  };
};

export const useSinglePresence = ({
  setIsScrolling,
}: {
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const utils = api.useContext();
  const { selectedChatId } = useStore();
  const [displayChain, setDisplayChain] = useState<ModMessage[]>([]);
  const [triggerCheck, setTriggerCheck] = useState<boolean>(true);
  const { user } = useAuth();

  let [sseSource, setSseSource] = useState<any>(null);

  let [temporaryResponse, setTemporaryResponse] = useState("");

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
    }
  );

  let handleSubmitPrompt = async () => {
    if (
      displayChain.length < 1 ||
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
        terminate(resp);
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

  function findMessageChainUptoIcluding(
    id: string,
    messages?: ModMessage[]
  ): ModMessage[] {
    const message = messages?.find((m) => m.id === id);

    if (!message) {
      return []; // message with the given id not found
    }

    if (!message.parent_id) {
      return [message]; // message has no parent, return itself
    }

    const parentMessage = messages?.find((m) => m.id === message.parent_id);

    if (!parentMessage) {
      return [message]; // parent message not found, return itself
    }

    const parentChain = findMessageChainUptoIcluding(
      parentMessage.id,
      messages
    );

    return parentChain ? [...parentChain, message] : [message];
  }

  function findMessageChainAfter(
    id: string,
    messages?: ModMessage[]
  ): ModMessage[] {
    if (!messages) return [];

    const latestMessage = messages.find((message) => message.id === id);

    if (!latestMessage) {
      return [];
    }

    const childMessages = messages.filter(
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

    return [
      latestMessage,
      ...findMessageChainAfter(latestChildMessage!.id, messages),
    ];
  }

  function findMessageChain(id: string, messages?: ModMessage[]) {
    return [
      ...findMessageChainUptoIcluding(id, messages),
      ...findMessageChainAfter(id, messages),
    ];
  }

  // Update display chain when thread messages change
  useEffect(() => {
    async function e() {
      if (!selectedChatId || !threadMessagesData?.messages) return;

      setDisplayChain(
        findMessageChain(
          threadMessagesData.messages[threadMessagesData.messages.length - 1]!
            .id,
          threadMessagesData?.messages
        )
      );
    }

    e();
  }, [threadMessagesData]);

  // Set and emit event for title, if not set already
  useEffect(() => {
    async function e() {
      if (
        !selectedChatId ||
        !threadData?.thread?.id ||
        !threadMessagesData?.messages
      )
        return;

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

  // When user navigates to new thread using sidebar, a check for auto prompt is triggered
  useEffect(() => {
    setTriggerCheck(true);
  }, [selectedChatId]);

  // If its a fresh open and user's question wasnt answered, auto prompt
  useEffect(() => {
    if (displayChain.length === 0 || !triggerCheck) return;

    setTriggerCheck(false);

    if (!!displayChain[displayChain.length - 1]?.sender_auth_id)
      handleSubmitPrompt();
  }, [displayChain]);

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

  function terminate(text?: string) {
    //close source, set msg data optimistically
    sseSource?.close();
    const lastMsg = displayChain[displayChain.length - 1];

    if (threadData?.thread.id && lastMsg && !!lastMsg.sender_auth_id) {
      pushMessageToThread({
        id: uuidv4(),
        parentId: lastMsg.id,
        senderAuthId: null,
        text: text || temporaryResponse,
        threadId: threadData?.thread.id,
      });
    }
  }

  function regenerate() {
    if (
      displayChain.length < 2 ||
      !displayChain[displayChain.length - 2]?.sender_auth_id
    )
      return;

    setDisplayChain((d) => d.slice(0, -1));
    setTriggerCheck(true);
  }


};
