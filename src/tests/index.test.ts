import { deserialize } from "../resp/deserialize";
import { serialize } from "../resp/serialize";

it("should serialize and deserialize bulk string input", () => {
  const input = "hello world";
  const serialized = serialize(input);
  const deserialized = deserialize(serialized);
  expect(deserialized).toEqual(input);
});
