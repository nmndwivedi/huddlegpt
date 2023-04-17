import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "~/hooks/auth";
import { ModMessage } from "~/lib/ts/modified";
import { Database } from "~/schema";
import { api } from "~/utils/api";
import SyntaxMessage from "./SyntaxMessage";

type Thread = Database["public"]["Tables"]["threads"]["Row"];

interface ListItemProps {
  message: ModMessage;
  thread: Thread;
}

const Message = ({ message, thread }: ListItemProps) => {
  const [value, setValue] = useState(message.text);
  const [isEditing, setIsEditing] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();

  const { data } = api.metadata.getMetadataForUser.useQuery(
    {
      userId: message.sender_auth_id,
    },
    { enabled: !!message.sender_auth_id }
  );

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setValue(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  useEffect(() => {
    if (isEditing && ta.current) {
      ta.current.style.height = "auto";
      ta.current.style.height = `${ta.current.scrollHeight}px`;
    }
  }, [isEditing]);

  return (
    <div
      className={`flex w-full gap-x-6 py-8 px-8 md:px-20 ${
        !message.sender_auth_id ? "bg-gray-200 dark:bg-gray-600" : ""
      }`}
    >
      <div className="flex flex-none flex-col items-center gap-y-1">
        <div className="group relative whitespace-nowrap">
          <img
            className="h-10 w-10 rounded-md border-2 border-white border-opacity-30"
            src={`${
              !message.sender_auth_id
                ? "/logo.png"
                : data?.metadata?.avatar || "/user.png"
            }`}
          />
          {!message.sender_auth_id && (
            <p className="absolute mt-2 hidden rounded-md bg-gray-300 px-2 py-1 text-center text-xs group-hover:block dark:bg-black">
              {thread.model}
              <br />
              Creativity:{" "}
              {thread.creativity === 0
                ? "Low"
                : thread.creativity === 1
                ? "Medium"
                : "High"}
            </p>
          )}
          {!!message.sender_auth_id && (
            <p className="absolute mt-2 hidden rounded-md bg-gray-300 px-2 py-1 text-center text-xs group-hover:block dark:bg-black">
              {data?.metadata?.username}
            </p>
          )}
        </div>
      </div>

      {!isEditing && (
        <div className="flex w-full items-start justify-between gap-x-3">
          <div className="w-full whitespace-pre-wrap break-words">
            {`${
              !message.sender_auth_id
                ? ""
                : // : message.sender_auth_id === user?.id
                  // ? "You (" + data?.metadata?.username + "): "
                  data?.metadata?.username + ": "
            }`}
            {!!message.sender_auth_id ? (
              message.text
            ) : (
              <SyntaxMessage text={message.text} />
            )}
          </div>
          {!!message.sender_auth_id && (
            <button className="flex-none" onClick={(e) => setIsEditing(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <div className="flex w-full flex-col items-start gap-y-4">
          <textarea
            value={value}
            autoFocus
            ref={ta}
            className="h-full w-full bg-transparent outline-none"
            onChange={handleChange}
          />
          <div className="flex items-center gap-x-4">
            <button className="rounded-md bg-emerald-600 px-4 py-2 text-white active:bg-emerald-700">
              Save & Submit
            </button>
            <button
              onClick={(e) => setIsEditing(false)}
              className="rounded-md border border-gray-400 px-4 py-2 active:border-opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
