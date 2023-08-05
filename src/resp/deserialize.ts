export const deserialize = (input: string) => {
  let parsed = null;
  let inputSplitted = input.split("\r\n");

  for (let i = 0; i < inputSplitted.length; i++) {
    const cmd = inputSplitted[i];
    if (cmd.includes("*")) {
      parsed = [];
    }
    if (cmd.includes("$")) {
      parsed.push(inputSplitted[i + 1]);
    }
  }
  return parsed.join(" ");
};
