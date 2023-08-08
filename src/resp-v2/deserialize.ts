const splitData = (data: string): [string, string] => {
  const [head, ...tail] = data.split("\r\n");
  return [head, tail.join("\r\n")];
};

const readSimpleString = (data: string): [string, string] => {
  const [head, tail] = splitData(data);
  return [head, tail];
};

const readBulkString = (data: string): [string, string] => {
  const [lengthStr, tail] = splitData(data);
  const length = parseInt(lengthStr);
  const value = tail.substring(0, length);
  const remainingTail = tail.substring(length + 2); // +2 for skipping '\r\n'
  return [value, remainingTail];
};

const readArray = (data: string): [string | string[], string] => {
  const [arrLength, tail] = splitData(data);
  const count = parseInt(arrLength);

  let remainingData = tail;
  const items: string[] = Array.from({ length: count }).map(() => {
    const [parsedItem, newTail] = parseRESP(remainingData);
    remainingData = newTail;
    return parsedItem;
  });

  return [items, remainingData];
};

function parseRESP(data: string) {
  if (data === "$-1\r\n") return [null, undefined];
  const type = data[0];

  switch (type) {
    case "+":
    case "-":
      return readSimpleString(data.slice(1));
    case "$":
      return readBulkString(data.slice(1));
    case "*":
      return readArray(data.slice(1));
    default:
      throw new Error(`Unsupported data type: ${type}`);
  }
}

export const deserialize = (input: string) => parseRESP(input)[0];
