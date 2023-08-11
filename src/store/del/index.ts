import { valinorVault, valinorVaultTimeouts } from "../valinor-vault";

export const deleteKeyValPair = (keys: string[]) => {
  return keys.reduce((acc, key) => {
    if (valinorVaultTimeouts.has(key)) {
      const isTimeoutDeleted = valinorVaultTimeouts.delete(key);
      const isKeyDeleted = valinorVault.delete(key);

      return acc + (isTimeoutDeleted && isKeyDeleted ? 1 : 0);
    } else if (valinorVault.has(key)) {
      return acc + (valinorVault.delete(key) ? 1 : 0);
    }
    return acc;
  }, 0);
};
