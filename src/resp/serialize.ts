export const serialize = (input: string) => {
  const inputSplittedBySpace = input.split(" ");

  const bulkStrings = inputSplittedBySpace.map(
    (cmd) => `$${cmd.length}\r\n${cmd}\r\n`
  );
  const encoded = `*${bulkStrings.length}\r\n${bulkStrings.join("")}`;
  return encoded;
};
