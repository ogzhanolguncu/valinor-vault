export const serialize = (input: any): string => {
  if (input === null) return "$-1\r\n";

  if (typeof input === "string") {
    return `$${input.length}\r\n${input}\r\n`;
  }

  if (typeof input === "string") {
    return `$${input.length}\r\n${input}\r\n`;
  }

  if (Array.isArray(input)) {
    const items = input.map((item) => serialize(item));
    return `*${items.length}\r\n${items.join("")}`;
  }
};
