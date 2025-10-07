import { storage_prefix } from "@/globals";

export default class Storage {
  public static clearAllStorage = (): void => {
    for (var a: number = 0; a < localStorage.length; a++) {
      const key = localStorage.key(a);
      if (!key || key.indexOf(storage_prefix) !== 0) continue;
      localStorage.removeItem(key);
    }
  };

  public static clearStorageValue = (name: string): void => {
    localStorage.removeItem(`${storage_prefix}_${name}`);
  };

  public static getStorageValue = (name: string): StorageValue | null => {
    try {
      const stringed_value = localStorage.getItem(`${storage_prefix}_${name}`);
      if (stringed_value === null) return null;
      const storageValue: StorageValue = JSON.parse(stringed_value);
      return storageValue;
    } catch (err: any) {
      return null;
    }
  };

  public static setStorageValue = (name: string, value: any): void => {
    try {
      const storage_value: StorageValue = { value, time_stamp: Date.now() };
      const stringed_value = JSON.stringify(storage_value);
      localStorage.setItem(`${storage_prefix}_${name}`, stringed_value);
    } catch (err: any) {}
  };
}
