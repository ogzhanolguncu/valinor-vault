export const deserialize = (input: string) => {
  if (input.startsWith("+")) {
    return input.slice(1).split("\r\n")[0];
  }

  if (input.startsWith("-")) {
    throw new Error(input.slice(1).split("\r\n")[0]);
  }

  if (input.startsWith(":")) {
    return parseInt(input.slice(1).split("\r\n")[0], 10);
  }

  if (input === "$-1\r\n") return null;

  if (input.startsWith("$")) {
    const [length, value] = input.slice(1).split("\r\n");
    const expectedLength = parseInt(length, 10);
    if (value.length !== expectedLength) {
      throw new Error("Invalid bulk string length");
    }

    return value;
  }

  if (input.startsWith("*")) {
    const parts = input
      .slice(1)
      .split("\r\n")
      .filter((p) => p !== "");
    const itemCount = parseInt(parts[0], 10);
    let items: any[] = [];
    for (let i = 1; i <= itemCount * 2; i += 2) {
      items.push(deserialize(`${parts[i]}\r\n${parts[i + 1]}\r\n`));
    }
    return items;
  }
  throw new Error(`Unknown data type`);
};
