import { decideSetStrategy } from "../set";
import { valinorVault } from "../valinor-vault";

export const decrementIfExists = (key: string): number | string => {
  const value = valinorVault.get(key);

  if (value) {
    const numValue = Number(value);

    if (!Number.isNaN(numValue) && Number.isInteger(numValue)) {
      const updatedVal = numValue - 1;
      valinorVault.set(key, String(updatedVal));
      return updatedVal;
    } else {
      return "-value is not an integer or out of range";
    }
  } else {
    decideSetStrategy([key, "-1"]);
    return -1;
  }
};
