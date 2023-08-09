import { serialize } from "../resp-v2/serialize";
import { throwIfNumOfArgsWrong } from "./utils";
import { valinorVault, valinorVaultTimeouts } from "./valinor-vault";

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
    case "set": {
      return serialize(decideSetStrategy(args as Payload));
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

// EX seconds -- Set the specified expire time, in seconds.
// PX milliseconds -- Set the specified expire time, in milliseconds.
// EXAT timestamp-seconds -- Set the specified Unix time at which the key will expire, in seconds.
// PXAT timestamp-milliseconds -- Set the specified Unix time at which the key will expire, in milliseconds.

type Payload =
  | [string, string, "EX" | "PX" | "EAXT" | "PXAT", string];
const decideSetStrategy = (args: Payload) => {
  const [key, value, expiryVariant, ttl] = args;
  if (expiryVariant && ttl) {
    const numberTTL = parseInt(ttl);
    switch (expiryVariant) {
      case "EX":
        return setToStore(key, value, numberTTL * 1000);
      case "PX":
        return setToStore(key, value, numberTTL);
    }
  }
  return setToStore(key, value);
};

const setToStore = (
  key: string,
  value: string,
  expirationMillis?: number
) => {
  if (!expirationMillis) {
    valinorVault.set(key, value);
    return "+OK" as const;
  }
  valinorVault.set(key, value);
  const expirationTime = Date.now() + expirationMillis;
  valinorVaultTimeouts.set(key, expirationTime);

  setTimeout(() => {
    const storedExpiration = valinorVaultTimeouts.get(key);
    const currentTime = Date.now();
    const gracePeriod = 5;

    if (
      storedExpiration &&
      Math.abs(storedExpiration - currentTime) <= gracePeriod
    ) {
      valinorVault.delete(key);
      valinorVaultTimeouts.delete(key);
    }
  }, expirationMillis);

  return "+OK" as const;
};
