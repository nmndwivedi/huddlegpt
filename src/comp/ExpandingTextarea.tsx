import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import {
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
  CSSProperties,
} from "react";

interface ExpandingTextareaProps {
  maxRows: number;
}

export function ExpandingTextarea({ maxRows = 12 }: ExpandingTextareaProps) {
  const [value, setValue] = useState("");

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setValue(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
    }
  };

  const textareaStyles: CSSProperties = {
    maxHeight: `${maxRows * 20}px`,
  };

  return (
    <div className="absolute bottom-0 z-30 flex w-full justify-center">
      <div className="relative flex w-full max-w-2xl justify-center ">
        <textarea
          className="mx-12 mb-8 w-full rounded-md border-2 border-white border-opacity-30 py-3 pr-16 pl-6 dark:bg-gray-800"
          style={textareaStyles}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <button className="absolute bottom-12 right-16 active:opacity-60">
          <PaperAirplaneIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
