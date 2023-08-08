import { serialize } from "../resp-v2/serialize";
import { throwIfNumOfArgsWrong } from "./utils";
import { valinorVault } from "./valinor-vault";

export function handleCommand(command: string | number | any[]) {
  if (!Array.isArray(command)) {
    return serialize(
      "-ERR unknown command or wrong number of arguments\r\n"
    );
  }

  const [cmd, ...args] = command;
  switch (cmd.toLowerCase()) {
    case "ping":
      return serialize("+pong");
    case "echo":
      if (args.length !== 1) {
        return throwIfNumOfArgsWrong("echo");
      } else {
        return serialize(args[0]);
      }
      break;
    case "set": {
      const [key, value] = args;
      valinorVault.set(key, value);
      return serialize("+OK");
    }

    case "get": {
      if (args.length !== 1) {
        return throwIfNumOfArgsWrong("get");
      }

      const [key] = args;
      if (valinorVault.has(key)) {
        return serialize(valinorVault.get(key));
      } else return serialize(null);
    }
    case "command":
      return serialize(null);
    default:
      return serialize(`-ERR unknown command '${cmd}'`);
  }
}
