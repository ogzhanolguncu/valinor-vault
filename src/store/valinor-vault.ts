export let valinorVault = new Map<string, any>();
export const valinorVaultTimeouts = new Map<string, number>();

export const replaceWithBackup = (newMap: Map<string, unknown>) => {
  valinorVault = newMap;
};
