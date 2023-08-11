import { valinorVault } from "../valinor-vault";

export const createAList = (args: string[], variant: "L" | "R") => {
  const [key, ...values] = args;
  const storedValue = valinorVault.get(key);

  valinorVault.set(
    key,
    variant === "L" ? [...(storedValue ?? []), ...values] : [...values, ...(storedValue ?? [])]
  );
  return valinorVault.get(key).length;
};
