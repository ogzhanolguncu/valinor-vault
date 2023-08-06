import { deserialize } from "../resp/deserialize";
import { serialize } from "../resp/serialize";

describe("RESP serialization", () => {
  test("should serialize a null bulk string", () => {
    expect(serialize(null)).toBe("$-1\r\n");
  });

  test("should serialize a bulk string", () => {
    expect(serialize("ping")).toBe("$4\r\nping\r\n");
  });

  test("should serialize an array of bulk strings", () => {
    expect(serialize(["echo", "hello world"])).toBe(
      "*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n"
    );
  });

  test("should serialize an simple string", () => {
    expect(serialize("+pong")).toBe("+pong\r\n");
  });
});

describe("RESP deserialization", () => {
  test("should deserialize a null bulk string", () => {
    expect(deserialize("$-1\r\n")).toBe(null);
  });

  test("should deserialize a bulk string", () => {
    expect(deserialize("$4\r\nping\r\n")).toBe("ping");
  });

  test("should deserialize an array of bulk strings", () => {
    expect(
      deserialize("*2\r\n$4\r\necho\r\n$11\r\nhello world\r\n")
    ).toEqual(["echo", "hello world"]);
  });

  test("should deserialize an empty string", () => {
    expect(deserialize("$0\r\n\r\n")).toBe("");
  });
});
