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

const getData = (key: string): Promise<Entity | string | null> => {
  return new Promise((resolve) => {
    request = indexedDB.open(DBName);

    request.onsuccess = () => {
      console.log('request.onsuccess - getAllData');
      db = request.result;
      const tx = db.transaction(StoreName, 'readonly');
      const store = tx.objectStore(StoreName);
      const res = store.get(key);
      res.onsuccess = (event) => {
        const dbData: Entity = (event.target as IDBRequest).result;
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

const dbService = { initDB, addData, getData };

export default dbService;
