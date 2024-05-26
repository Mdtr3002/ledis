import { useCallback, useEffect, useState } from 'react';

import ExpireCommand from '../services/expire-command.service';
import KeyCommand from '../services/key-command.service';
import ListCommand from '../services/list-command.service';
import SetCommand from '../services/set-command.service';
import SnapshotCommand from '../services/snapshot-service';
import StringCommand from '../services/string-command.service';

export type LedisStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR';

export type LedisClient = {
  status: LedisStatus;
  call: (command: string[]) => Promise<string>;
};

interface CommandList {
  [key: string]: (command: string[]) => Promise<string>;
}

const commandList: CommandList = {
  SET: StringCommand.SET,
  GET: StringCommand.GET,
  RPUSH: ListCommand.RPUSH,
  RPOP: ListCommand.RPOP,
  LRANGE: ListCommand.LRANGE,
  SADD: SetCommand.SADD,
  SREM: SetCommand.SREM,
  SMEMBERS: SetCommand.SMEMBERS,
  SINTER: SetCommand.SINTER,
  KEYS: KeyCommand.KEYS,
  DEL: KeyCommand.DEL,
  EXPIRE: ExpireCommand.EXPIRE,
  TTL: ExpireCommand.TTL,
  SAVE: SnapshotCommand.SAVE,
  RESTORE: SnapshotCommand.RESTORE,
};

export const useLedis = (DBName: string, StoreName: string): LedisClient => {
  const [status, setStatus] = useState<LedisStatus>('INACTIVE');

  const initDB = useCallback((): Promise<boolean> => {
    let request: IDBOpenDBRequest;
    let db: IDBDatabase;
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
        resolve(true);
      };
    });
  }, [DBName, StoreName]);

  useEffect(() => {
    initDB().then((isSuccess) => {
      if (isSuccess) {
        setStatus('ACTIVE');
      } else {
        setStatus('ERROR');
      }
    });
  }, [initDB]);

  const handleLedisCommand = (command: string[]) => {
    const commandKeyWord: string = command[0].toUpperCase();
    if (commandKeyWord in commandList) return commandList[commandKeyWord](command);
    throw new Error('Unknown Command');
  };

  return {
    status,
    call: handleLedisCommand,
  };
};
