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
      console.log('Open DB success', version);
      resolve(true);
    };
  });
};

const addData = (data: Entity): Promise<Entity | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName, version);

    request.onsuccess = (event) => {
      console.log('request.onsuccess - addData', data);
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
      console.log('request.onsuccess - getAllData');
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
      console.log('request.onsuccess - getAllKeys');
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
      console.log('request.onsuccess - deleteKeys');
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

const dbService = { initDB, addData, getData, getAllKeys, deleteKey };

export default dbService;
