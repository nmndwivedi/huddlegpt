import { TRPCClientError } from "@trpc/client";
import { z, ZodRawShape } from "zod";

export function getAlertMsg(error: unknown) {
  if (error instanceof TRPCClientError) {
    return `Error occured: ${error.message}`;
  } else if (error instanceof z.ZodError) {
    // console.log(generateErrorMessage(error.issues, options));
    console.log(error.issues);
  } else {
    return "Something went wrong";
  }
}

export function getZodErrors(errors: z.ZodError) {
  //iterate through errors and make { path: "code" + "message" } object

  const cumulative: {
    [key: string]: string;
  } = {};

  const issues = errors.issues.reduce((previous, i) => {
    const path = i.path[0];
    const prevIssues = (path && previous[path]) ?? "";

    return !path
      ? previous
      : {
          ...previous,
          [path]:
            prevIssues +
            "→ " +
            i.code +
            (i.message ? ": " + i.message : "") +
            "\n",
        };
  }, cumulative);

  return issues;
}
