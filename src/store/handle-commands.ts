import { serialize } from "../resp-v2/serialize";
import { deleteKeyValPair } from "./del";
import { checkIfKeyValExists } from "./exists";
import { incrementIfExists } from "./incr";
import { Payload, decideSetStrategy } from "./set";
import { throwIfNumOfArgsWrong } from "./utils";
import { valinorVault } from "./valinor-vault";

export function handleCommand(command: string | number | any[]) {
  if (!Array.isArray(command)) {
    return serialize("-ERR unknown command or wrong number of arguments\r\n");
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
    case "set": {
      return serialize(decideSetStrategy(args as Payload));
    }
    case "exists": {
      return serialize(checkIfKeyValExists(args));
    }
    case "del": {
      return serialize(deleteKeyValPair(args));
    }
    case "incr": {
      return serialize(incrementIfExists(args[0]));
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
