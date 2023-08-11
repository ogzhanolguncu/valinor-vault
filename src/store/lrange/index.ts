import { valinorVault } from "../valinor-vault";

export const getAList = (args: string[]) => {
  const [key, ...range] = args;
  if (range.length < 2) return "-ERR wrong number of arguments for command\r\n";

  const list = valinorVault.get(key);
  if (!list || !Array.isArray(list)) return [];
  return getRangeValues(list, Number(range[0]), Number(range[1]));
};

function getRangeValues(arr: any[], start: number, end: number) {
  if (end < 0) {
    end = arr.length + end + 1; // convert negative index to positive and adjust to include the end
  } else {
    end += 1; // adjust to include the end
  }

  return arr.slice(start, end);
}
