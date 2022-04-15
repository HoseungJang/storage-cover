export interface WrappedStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  get length(): number;
}

export function wrapLocalStorage(): WrappedStorage {
  return wrapStorage(window.localStorage);
}

export function wrapSessionStorage(): WrappedStorage {
  return wrapStorage(window.sessionStorage);
}

function wrapStorage(storage: Storage): WrappedStorage {
  let inmemoryStorage: { [key: string]: string } = {};
  return {
    get: (key) => {
      if (!isSupported(storage)) {
        return inmemoryStorage[key] ?? null;
      } else {
        return storage.getItem(key);
      }
    },
    set: (key, value) => {
      if (!isSupported(storage)) {
        inmemoryStorage[key] = value;
      } else {
        storage.setItem(key, value);
      }
    },
    remove: (key) => {
      if (!isSupported(storage)) {
        delete inmemoryStorage[key];
      } else {
        storage.removeItem(key);
      }
    },
    clear: () => {
      if (!isSupported(storage)) {
        inmemoryStorage = {};
      } else {
        storage.clear();
      }
    },
    key: (index) => {
      if (!isSupported(storage)) {
        return Object.keys(inmemoryStorage)[index] ?? null;
      } else {
        return storage.key(index);
      }
    },
    get length() {
      if (!isSupported(storage)) {
        return Object.keys(inmemoryStorage).length;
      } else {
        return storage.length;
      }
    },
  };
}

function isSupported(storage: Storage) {
  try {
    const key = new Array(4)
      .fill(null)
      .map(() => Math.random().toString(36).slice(2))
      .join("");
    storage.setItem(key, key);
    const result = storage.getItem(key) === key;
    storage.removeItem(key);
    return result;
  } catch (e) {
    return false;
  }
}
