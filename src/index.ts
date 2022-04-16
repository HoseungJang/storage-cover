export interface WrappedStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  get length(): number;
}

const isSSR = typeof window === "undefined";

export function wrapLocalStorage(): WrappedStorage {
  return isSSR ? createInmemoryStorage() : wrapStorage(window.localStorage);
}

export function wrapSessionStorage(): WrappedStorage {
  return isSSR ? createInmemoryStorage() : wrapStorage(window.sessionStorage);
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

export function wrapStorage(storage: Storage): WrappedStorage {
  const inmemoryStorage = createInmemoryStorage();
  return {
    get: (key) => {
      if (!isSupported(storage)) {
        return inmemoryStorage.get(key);
      } else {
        return storage.getItem(key);
      }
    },
    set: (key, value) => {
      if (!isSupported(storage)) {
        inmemoryStorage.set(key, value);
      } else {
        storage.setItem(key, value);
      }
    },
    remove: (key) => {
      if (!isSupported(storage)) {
        inmemoryStorage.remove(key);
      } else {
        storage.removeItem(key);
      }
    },
    clear: () => {
      if (!isSupported(storage)) {
        inmemoryStorage.clear();
      } else {
        storage.clear();
      }
    },
    key: (index) => {
      if (!isSupported(storage)) {
        return inmemoryStorage.key(index);
      } else {
        return storage.key(index);
      }
    },
    get length() {
      if (!isSupported(storage)) {
        return inmemoryStorage.length;
      } else {
        return storage.length;
      }
    },
  };
}

export function createInmemoryStorage(): WrappedStorage {
  let storage: { [key: string]: string } = {};
  return {
    get: (key) => {
      return storage[key] ?? null;
    },
    set: (key, value) => {
      storage[key] = value;
    },
    remove: (key) => {
      delete storage[key];
    },
    clear: () => {
      storage = {};
    },
    key: (index) => {
      return Object.keys(storage)[index] ?? null;
    },
    get length() {
      return Object.keys(storage).length;
    },
  };
}
