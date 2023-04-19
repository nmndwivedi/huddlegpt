import {
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
  CSSProperties,
  useRef,
} from "react";
import Spinner from "./Spinner";

interface ExpandingTextareaProps {
  callback: (message: string) => Promise<boolean>;
  maxRows: number;
}

export function ExpandingTextarea({
  callback,
  maxRows = 12,
}: ExpandingTextareaProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const ta = useRef<HTMLTextAreaElement>(null);

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    setValue(event.target.value);
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleTextSubmit();
    }
  };

  async function handleTextSubmit() {
    if (value.trim() === "") {
      setValue("");
      return;
    }

    setSending(true);

    const res = await callback(value);

    if (res) {
      setSending(false);
      setValue("");
      if (ta.current) ta.current.style.height = "68px";
    }
  }

  const textareaStyles: CSSProperties = {
    height: "72px",
    maxHeight: `${maxRows * 20}px`,
  };

  return (
    <div className="absolute bottom-0 z-40 flex w-full justify-center">
      <div className="relative flex w-full max-w-2xl justify-center ">
        <textarea
          className="mx-12 mb-8 w-full z-10 rounded-md border border-gray-400 py-3 pr-16 pl-6 shadow-inner dark:border-gray-400 dark:bg-gray-800"
          style={textareaStyles}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={ta}
        />
        <button
          onClick={(e) => handleTextSubmit()}
          className="absolute bottom-12 right-16 active:opacity-60"
        >
          {!sending && (
            <svg
              fill="#000000"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 214.3 214.3"
              xmlSpace="preserve"
              className="h-7 w-7 fill-current"
            >
              <path d="M214 30v-1h-1v-1h-1l-1-1h-2L3 84a4 4 0 0 0 0 8l76 24-10 48a4 4 0 0 0 6 4l29-16 23 33 3 2 4-2 80-152a4 4 0 0 0 0-3zM18 88l168-46-105 67-63-21zm60 69 8-32 14 20-22 12zm52 19-42-61v-1l112-72-70 134z" />
            </svg>
          )}
          {sending && <Spinner />}
        </button>
      </div>
      <div className="pointer-events-none absolute bottom-0 z-0 h-32 w-full bg-gradient-to-t from-black opacity-60"></div>
    </div>
  );
}
