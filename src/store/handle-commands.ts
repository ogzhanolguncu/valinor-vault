import { serialize } from "../resp-v2/serialize";
import { throwIfNumOfArgsWrong } from "./utils";
import { valinorVault, valinorVaultTimeouts } from "./valinor-vault";

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

type Payload = [string, string, string?, number?];

const decideSetStrategy = (args: Payload) => {
  const [key, value, expiryVariant, ttl] = args;

  if (expiryVariant && ttl) {
    const numberTTL = parseInt(ttl.toString());

    if (isTimeInThePast(numberTTL, expiryVariant)) {
      return `-ERR ${expiryVariant} is in the past\r\n`;
    }

    switch (expiryVariant) {
      case "EX":
        return setToStore(key, value, numberTTL * 1000);
      case "PX":
        return setToStore(key, value, numberTTL);
      case "EXAT":
        return setToStore(key, value, numberTTL * 1000 - Date.now());
      case "PXAT":
        return setToStore(key, value, numberTTL - Date.now());
    }
  }
  return setToStore(key, value);
};

const isTimeInThePast = (time: number, variant: string): boolean => {
  if (variant === "EXAT") {
    return time * 1000 < Date.now();
  }
  if (variant === "PXAT") {
    return time < Date.now();
  }
  return false;
};

const setToStore = (key: string, value: string, expirationMillis?: number) => {
  valinorVault.set(key, value);

  if (expirationMillis) {
    const expirationTime = Date.now() + expirationMillis;
    valinorVaultTimeouts.set(key, expirationTime);

    setTimeout(() => {
      const storedExpiration = valinorVaultTimeouts.get(key);
      const currentTime = Date.now();
      const gracePeriod = 5;

      if (storedExpiration && Math.abs(storedExpiration - currentTime) <= gracePeriod) {
        valinorVault.delete(key);
        valinorVaultTimeouts.delete(key);
      }
    }, expirationMillis);
  }

  return "+OK" as const;
};
