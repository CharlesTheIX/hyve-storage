import { storagePrefix } from "@/globals";

export default class Storage {
  public static clearAllStorage = (): void => {
    for (var a: number = 0; a < localStorage.length; a++) {
      const key = localStorage.key(a);
      if (!key || key.indexOf(storagePrefix) !== 0) continue;
      localStorage.removeItem(key);
    }
  };

  public static clearStorageValue = (name: string): void => {
    localStorage.removeItem(`${storagePrefix}_${name}`);
  };

  public static getStorageValue = (name: string): StorageValue | null => {
    try {
      const stringedValue = localStorage.getItem(`${storagePrefix}_${name}`);
      if (stringedValue === null) return null;
      const storageValue: StorageValue = JSON.parse(stringedValue);
      return storageValue;
    } catch (err: any) {
      return null;
    }
  };

  public static setStorageValue = (name: string, value: any): void => {
    try {
      const storageValue: StorageValue = { value, timeStamp: Date.now() };
      const stringedValue = JSON.stringify(storageValue);
      localStorage.setItem(`${storagePrefix}_${name}`, stringedValue);
    } catch (err: any) {}
  };
}
