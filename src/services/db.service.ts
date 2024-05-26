import { DBName, StoreName } from '../constants/store';
import { Entity } from '../types/entity';

let request: IDBOpenDBRequest;
let db: IDBDatabase;
let version = 1;

const initDB = (): Promise<boolean> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName);

    request.onerror = () => {
      resolve(false);
    };

    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains(StoreName)) {
        db.createObjectStore(StoreName, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      version = db.version;
      resolve(true);
    };
  });
};

const addData = (data: Entity): Promise<Entity | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName, version);

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      store.put(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

const getData = (key: string): Promise<Entity | string | null | undefined> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      const res = store.get(key);
      res.onsuccess = (event) => {
        const dbData: Entity = (event.target as IDBRequest).result;
        if (dbData?.expireTime && new Date(dbData.expireTime) < new Date()) {
          store.delete(key);
          resolve(null);
        }
        resolve(dbData);
      };
    };
    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

const getAllKeys = (): Promise<string[] | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      const res = store.getAll();
      res.onsuccess = (event) => {
        const keys: Entity[] = (event.target as IDBRequest).result;
        const keyNameList: string[] = [];
        for (const el of keys) {
          if (el?.expireTime && new Date(el.expireTime) < new Date()) {
            store.delete(el.key);
          } else {
            keyNameList.push(el.key);
          }
        }
        resolve(keyNameList);
      };
    };
    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

const deleteKey = (keys: string): Promise<boolean> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      store.delete(keys);
      resolve(true);
    };
    request.onerror = () => {
      resolve(false);
    };
  });
};

const saveSnapshot = (): Promise<boolean | string> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      const res = store.getAll();
      res.onsuccess = (event) => {
        const keys: Entity[] = (event.target as IDBRequest).result;
        localStorage.setItem('indexedDBState', JSON.stringify(keys));
        resolve(true);
      };
    };
    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

const restoreSnapshot = (): Promise<boolean | string> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName, version);

    request.onsuccess = () => {
      db = request.result;
      const tx = db.transaction(StoreName, 'readwrite');
      const store = tx.objectStore(StoreName);
      const clearStorage = store.clear();
      clearStorage.onsuccess = () => {
        const keys = localStorage.getItem('indexedDBState');
        if (keys) {
          const parsedKeys: Entity[] = JSON.parse(keys);
          for (const el of parsedKeys) {
            store.put(el);
          }
          resolve(true);
        } else {
          resolve(false);
        }
      };
    };
    request.onerror = () => {
      const error = request.error?.message;
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

const dbService = {
  initDB,
  addData,
  getData,
  getAllKeys,
  deleteKey,
  saveSnapshot,
  restoreSnapshot,
};

export default dbService;
