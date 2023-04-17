import React from "react";
// @ts-ignore
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

const SyntaxMessage = ({ text }: { text: string }) => {
  const codeBlocks = text.split(/(```\w+\n[\s\S]+?```)/);

  return (
    <div>
      {codeBlocks.map((block, index) => {
        if (block.startsWith("```")) {
          const language = block.split("\n")[0]?.replace("```", "");
          const code = block.slice((language?.length || 0) + 4, -3);
          return (
            <div className="flex flex-col">
              <div className="-mb-2 flex w-full items-center justify-between rounded-t-md bg-neutral-800 p-2 px-4 text-xs">
                <div className="opacity-80">{language}</div>
                {/* <button onClick={() => {}}>Copy To Clipboard</button> */}
              </div>
              <SyntaxHighlighter
                language={language}
                style={atomDark}
                key={index}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          );
        } else {
          return <p key={index}>{block}</p>;
        }
      })}
    </div>
  );
};

export default SyntaxMessage;
