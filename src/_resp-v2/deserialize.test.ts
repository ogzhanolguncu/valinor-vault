import { deserialize } from "./deserialize";

describe("RESP Deserialize", () => {
  it("should deserialize simple string (-OK)", () => {
    const input = "+OK\r\n";
    expect(deserialize(input)).toBe("OK");
  });
  it("should deserialize simple error string (-ERR something)", () => {
    const input = "-Error message\r\n";
    expect(deserialize(input)).toBe("Error message");
  });
  it("should deserialize to null if receieves empty bulk string", () => {
    const input = "$-1\r\n";
    expect(deserialize(input)).toBe(null);
  });
  it("should deserialize bulk string", () => {
    const input = "$5\r\nworld\r\n";
    expect(deserialize(input)).toBe("world");
  });
  it("should deserialize array", () => {
    const input = "*2\r\n$7\r\nCOMMAND\r\n$4\r\nDOCS\r\n";
    expect(deserialize(input)).toEqual(["COMMAND", "DOCS"]);
  });
  it("should deserialize empty string", () => {
    const input = "$0\r\n\r\n";
    expect(deserialize(input)).toBe("");
  });
});
