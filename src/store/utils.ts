import { serialize } from "../resp-v2/serialize";

export function throwIfNumOfArgsWrong(variant: "echo" | "get"): any {
  return serialize(
    `-ERR wrong number of arguments for '${variant}' command`
  );
}
