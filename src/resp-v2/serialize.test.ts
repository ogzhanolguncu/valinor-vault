import { serialize } from "./serialize";

describe("RESP Serialize", () => {
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
