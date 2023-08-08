import { appendCRLF } from "./serializer-utils";

export const serialize = (input: any) => {
  if (input === null) return appendCRLF("$-1");

  if (typeof input === "string") {
    if (input.startsWith("+") || input.startsWith("-")) {
      return appendCRLF(input);
    }
    //Bulk string
    return appendCRLF(`$${input.length}`) + appendCRLF(input);
  }
  if (typeof input === "number" && Number.isInteger(input)) {
    return appendCRLF(`:${input}`);
  }
  if (Array.isArray(input)) {
    const serializedItems = input.map((item) => serialize(item));
    return (
      appendCRLF(`*${serializedItems.length}`) +
      serializedItems.join("")
    );
  }
  throw new Error(`Unsupported type: ${typeof input}`);
};
