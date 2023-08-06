export const deserialize = (input: string) => {
  if (input === "$-1\r\n") return null;

  if (input.startsWith("$")) {
    const [length, ...rest] = input.slice(1).split("\r\n");
    return rest[0];
  }

  if (input.startsWith("*")) {
    const parts = input
      .slice(1)
      .split("\r\n")
      .filter((p) => p !== "");
    const itemCount = parseInt(parts[0], 10);
    let items: any[] = [];
    for (let i = 1; i <= itemCount * 2; i += 2) {
      items.push(deserialize(`$${parts[i]}\r\n${parts[i + 1]}\r\n`));
    }
    return items;
  }
};
