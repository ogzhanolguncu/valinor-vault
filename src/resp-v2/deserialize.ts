import { chunk } from "./serializer-utils";

export const deserialize = (input: string) => {
  if (input === "$-1\r\n") return null;

  const dataType = input[0];
  const dataTypeRemovedPart = input.slice(1);
  const [header, ...rest] = dataTypeRemovedPart.split("\r\n");

  switch (dataType) {
    case "+":
    case "-":
      return header;
    case ":":
      return parseInt(header);
    case "$":
      if (parseInt(header) !== rest[0].length) {
        throw new Error("Invalid bulk string length");
      }
      return rest[0];
    case "*":
      //Remove empty string at the end of rest
      rest.pop();
      const redisArr = [];
      for (const pairs of chunk(rest, 2)) {
        redisArr.push(deserialize(`${pairs.join("\r\n")}\r\n`));
      }
      if (parseInt(header) !== redisArr.length) {
        throw new Error("Invalid array length");
      }
      return redisArr;
    default:
      throw new Error("Unsupported data type");
  }
};
