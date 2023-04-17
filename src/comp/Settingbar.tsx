import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

const Settingbar = () => {
  const [modelSettings, setModelSettings] = useState<{
    model: "GPT3.5T" | "GPT4";
    creativity: 0 | 1 | 2;
    role: string;
  }>({ model: "GPT3.5T", creativity: 1, role: "assistant" });
  const [parent] = useAutoAnimate();
  const [show, setShow] = useState(true);

  return (
    <div ref={parent} className="relative z-20 w-full">
      {show && (
        <div className="flex flex-row items-end gap-4 bg-gray-300 bg-opacity-60 py-4 px-8 text-sm backdrop-blur-sm dark:bg-gray-800 dark:bg-opacity-60 sm:items-center">
          <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-start">
            <select
              value={modelSettings.model}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setModelSettings((state) => ({
                  ...state,
                  model: e.target.value as any,
                }));
              }}
              className="w-36 rounded-md border border-gray-400 border-opacity-60 bg-gray-200 px-2 py-1 dark:bg-gray-900"
            >
              <option value={"GPT3.5T"}>GPT 3.5 Turbo</option>
              <option disabled value={"GPT4"}>
                GPT 4(Coming Soon)
              </option>
            </select>

            <div className="flex items-center gap-x-2">
              <p className="text-xs">Creativity:</p>
              <select
                value={modelSettings.creativity}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setModelSettings((state) => ({
                    ...state,
                    creativity: e.target.value as any,
                  }));
                }}
                className="rounded-md border border-gray-400 border-opacity-60 bg-gray-200 px-2 py-1 dark:bg-gray-900"
              >
                <option value={0}>Low</option>
                <option value={1}>Medium</option>
                <option value={2}>High</option>
              </select>
            </div>

            <div className="flex items-center gap-x-2">
              <p className="text-xs">Role:</p>
              <input
                value={modelSettings.role}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setModelSettings((state) => ({
                    ...state,
                    role: e.target.value.slice(0, 40),
                  }));
                }}
                className="w-36 rounded-none border-b border-gray-400 border-opacity-60 bg-gray-200 px-2 py-1 focus:outline-none dark:bg-gray-900"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={(e) => setShow(false)}>
              <ChevronUpIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
      {!show && (
        <div className="absolute flex w-full justify-end px-8">
          <button
            className="rounded-b bg-gray-400 px-4 dark:bg-gray-900"
            onClick={(e) => setShow(true)}
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Settingbar;
