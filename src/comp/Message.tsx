import React from "react";

const Message = ({
  id,
  sender,
  text,
}: {
  id: string;
  sender:
    | {
        type: "gpt";
        model: "GPT-3.5T" | "GPT-4";
        creativity: "low" | "medium" | "high";
      }
    | {
        type: "user";
        email: string;
        username?: string;
        pic?: string;
      };
  text: string;
}) => {
  return (
    <div
      className={`flex w-full gap-x-6 py-8 px-8 md:px-20 ${
        sender.type === "gpt" ? "bg-gray-200 dark:bg-gray-600" : ""
      }`}
    >
      <div className="flex flex-none flex-col items-center gap-y-1">
        <div className="group relative whitespace-nowrap">
          <img
            className="h-10 w-10 rounded-md border-2 border-white border-opacity-30"
            src={`${sender.type === "gpt" ? "/logo.png" : sender.pic}`}
          />
          {sender.type === "gpt" && (
            <p className="absolute mt-2 hidden rounded-md bg-gray-300 dark:bg-black px-2 py-1 text-center text-xs group-hover:block">
              {sender.model}
              <br />
              Creativity: {sender.creativity}
            </p>
          )}
          {sender.type === "user" && (
            <p className="absolute mt-2 hidden rounded-md bg-gray-300 dark:bg-black px-2 py-1 text-center text-xs group-hover:block">
              {sender.username}
            </p>
          )}
        </div>
      </div>
      <p>
        {`${
          sender.type === "gpt" ? "" : (sender.username || sender.email) + ": "
        }`}
        {text}
      </p>
    </div>
  );
};

export default Message;
