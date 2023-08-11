import fs from "fs";
import { replaceWithBackup, valinorVault } from "../valinor-vault";

const DB_NAME = "valinorVault.json";
export const save = () => {
  const serializedMap = JSON.stringify(Array.from(valinorVault.entries()));
  fs.writeFile(DB_NAME, serializedMap, (err) => {
    if (err) throw err;
  });
  return "+OK";
};

export const restoreFromBackup = () => {
  fs.readFile(DB_NAME, "utf8", (err, data) => {
    if (err) throw err;

    const entries = JSON.parse(data);
    replaceWithBackup(new Map(entries));
    console.log("DB restored succesfully");
  });
};
