import { valinorVault } from "../valinor-vault";

export const decideExistsStrategy = (args: string[] | string) => {
  if (Array.isArray(args)) {
    const count = args.reduce((acc, crr) => acc + (valinorVault.has(crr) ? 1 : 0), 0);
    return count;
  }
  return valinorVault.has(args) ? 1 : 0;
};
