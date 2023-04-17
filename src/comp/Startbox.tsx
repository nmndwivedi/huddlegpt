import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ExpandingTextarea } from "~/comp/ExpandingTextarea";
import { useAuth } from "~/hooks/auth";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import useStore from "~/store/store";

const Startbox = ({
  setModalOpen,
}: {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user, metadata } = useAuth();
  const r = useRouter();
  const [modelSettings, setModelSettings] = useState<{
    model: "GPT3.5T" | "GPT4";
    creativity: 0 | 1 | 2;
    role: string;
  }>({ model: "GPT3.5T", creativity: 1, role: "assistant" });
  const { selectedChatId, setSelectedChatId } = useStore();
  const utils = api.useContext();

  const { mutate: generateNewThreadWithMessage } =
    api.threads.generateNewThreadWithMessage.useMutation({
      onMutate: async (newThread) => {
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        utils.threads.getThread.cancel({ id: newThread.id });
        utils.messages.getThreadMessages.cancel({
          id: newThread.id,
        });

        // Optimistically update to the new value
        utils.threads.getThread.setData(
          { id: newThread.id },
          {
            thread: {
              id: newThread.id,
              created_at: new Date().toISOString(),
              admin_auth_id: user!.id,
              creativity: newThread.creativity,
              model: newThread.model,
              prompter_link: null,
              role: newThread.role,
              title: null,
              updated_at: new Date().toISOString(),
              viewer_link: null,
            },
          }
        );

        utils.messages.getThreadMessages.setData(
          {
            id: newThread.id,
          },
          {
            messages: [
              ...(newThread.text
                ? [
                    {
                      id: newThread.msgId,
                      thread_id: newThread.id,
                      sender_auth_id: user!.id,
                      text: newThread.text,
                      created_at: new Date().toISOString(),
                      parent_id: null,
                      indices: {
                        depthIndex: 0,
                        leftSiblingId: null,
                        rightSiblingId: null,
                        siblingCount: 0,
                        siblingIndex: -1,
                      },
                    },
                  ]
                : []),
            ],
          }
        );
      },
      // If the mutation fails, use the context we returned above
      onError: (err, newThread, context) => {
        utils.threads.getThread.reset({ id: newThread.id });
        utils.messages.getThreadMessages.reset({ id: newThread.id });
      },
      // Always refetch after error or success:
      onSettled: (data, error, newThread) => {
        utils.threads.getThread.invalidate({ id: newThread.id });
        utils.messages.getThreadMessages.invalidate({ id: newThread.id });
      },
    });

  const handleEvent = async () => {
    await startThread(null);
  };

  useEffect(() => {
    document.removeEventListener("message-gen-from-topbar", handleEvent);

    document.addEventListener("message-gen-from-topbar", handleEvent);

    return () => {
      document.removeEventListener("message-gen-from-topbar", handleEvent);
    };
  }, [user, modelSettings]);

  async function startThread(message: string | null) {
    /*
        - If not logged in, open modal
        - Create a thread with settings and initial message
        - Redirect the user to chat page
        */

    if (!user) {
      setModalOpen(true);
      return false;
    }

    try {
      /*
        Generate new thread with msg
        set selChatId
        Optimistically update and refetch on success:
            - getUserThreads
            - getThread (for threadId)
            - getThreadMessages (for threadId)
        Chatbox set with 1 initial message (how?)
      */

      const threadId = uuidv4();
      const msgId = uuidv4();

      generateNewThreadWithMessage({
        id: threadId,
        model: modelSettings.model,
        creativity: modelSettings.creativity,
        role: modelSettings.role,
        msgId,
        text: message,
        avatar: user.user_metadata.avatar_url,
        username: metadata?.username || user.email,
      });

      setSelectedChatId(threadId);

      if (!message) r.push(`/chat/${threadId}?share=true`);
    } catch (e) {
      alert("Something went wrong, please try again");
      return false;
    }

    return true;
  }

  return (
    <>
      <Initializer
        modelSettings={modelSettings}
        setModelSettings={setModelSettings}
      />
      <ExpandingTextarea callback={startThread} maxRows={12} />
    </>
  );
};

function Initializer({
  modelSettings,
  setModelSettings,
}: {
  modelSettings: {
    model: "GPT3.5T" | "GPT4";
    creativity: 0 | 1 | 2;
    role: string;
  };
  setModelSettings: React.Dispatch<
    React.SetStateAction<{
      model: "GPT3.5T" | "GPT4";
      creativity: 0 | 1 | 2;
      role: string;
    }>
  >;
}) {
  return (
    <div className="mt-40 flex w-full flex-1 flex-col items-center justify-start gap-y-3 text-base font-light">
      <p className="mb-2 text-xl opacity-30">Start a new chat</p>

      <div className="flex items-center gap-x-2">
        Model:
        <select
          value={modelSettings.model}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setModelSettings((state) => ({
              ...state,
              model: e.target.value as any,
            }));
          }}
          className="w-36 rounded-md border border-gray-400 bg-gray-200 px-2 py-1 dark:bg-gray-900"
        >
          <option value={"GPT3.5T"}>GPT 3.5 Turbo</option>
          <option disabled value={"GPT4"}>
            GPT 4(Coming Soon)
          </option>
        </select>
      </div>
      <div className="flex items-center gap-x-2">
        Creativity:
        <select
          value={modelSettings.creativity}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setModelSettings((state) => ({
              ...state,
              creativity: e.target.value as any,
            }));
          }}
          className="rounded-md border border-gray-400 bg-gray-200 px-2 py-1 dark:bg-gray-900"
        >
          <option value={0}>Low</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
        </select>
      </div>
      <div className="flex items-center gap-x-2">
        Role:
        <input
          value={modelSettings.role}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setModelSettings((state) => ({
              ...state,
              role: e.target.value.slice(0, 40),
            }));
          }}
          className="w-36 rounded-none border-b border-gray-400 bg-gray-200 px-2 py-1 focus:outline-none dark:bg-gray-900"
        />
      </div>
    </div>
  );
}

export default Startbox;
