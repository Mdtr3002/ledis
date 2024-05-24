import { Entity } from '../types/entity';

import dbService from './db.service';

const handleSetAddCommand = async (command: string[]) => {
  if (command.length < 3) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'object' && !(data?.value instanceof Set))
    return 'Error: Operation against a key holding the wrong kind of value';
  if (typeof data === 'string') return 'Error';
  const initializeValue = command.slice(2);
  if (data === undefined || data === null) {
    const value = new Set(initializeValue);
    const insertedData = await dbService.addData({ key, value });
    if (typeof insertedData === 'string' || insertedData === null) return 'Error';
    return insertedData?.value instanceof Set ? insertedData.value.size.toString() : 'Error';
  } else if (data.value instanceof Set) {
    const existingValue: Set<string> = data.value;
    const initialLength = existingValue.size;
    initializeValue.forEach((element) => {
      existingValue.add(element);
    });
    let insertedData;
    if (data.expireTime) {
      insertedData = await dbService.addData({
        key,
        value: existingValue,
        expireTime: data.expireTime,
      });
    } else insertedData = await dbService.addData({ key, value: existingValue });
    if (typeof insertedData === 'string' || insertedData === null) return 'Error';
    return insertedData?.value instanceof Set
      ? (insertedData.value.size - initialLength).toString()
      : 'Error';
  }
  return 'Error';
};

const handleSetRemoveCommand = async (command: string[]) => {
  if (command.length < 3) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'object' && !(data?.value instanceof Set))
    return 'Error: Operation against a key holding the wrong kind of value';
  if (data === null || data === undefined) return '0';
  if (typeof data === 'string') return 'Error';
  if (data.value instanceof Set) {
    const existingValue: Set<string> = data.value;
    let deletionCount = 0;
    command.slice(2).forEach((element) => {
      if (existingValue.has(element)) {
        existingValue.delete(element);
        deletionCount++;
      }
    });
    let insertedData;
    if (data.expireTime) {
      insertedData = await dbService.addData({
        key,
        value: existingValue,
        expireTime: data.expireTime,
      });
    } else insertedData = await dbService.addData({ key, value: existingValue });
    if (typeof insertedData === 'string' || insertedData === null) return 'Error';
    return insertedData?.value instanceof Set ? deletionCount.toString() : 'Error';
  }
  return '0';
};

const handleSetMembersCommand = async (command: string[]) => {
  if (command.length !== 2) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'object' && !(data?.value instanceof Set))
    return 'Error: Operation against a key holding the wrong kind of value';
  if (data === null || data === undefined) return '(empty set)';
  if (typeof data === 'string') return 'Error';
  if (data.value instanceof Set) {
    const value = Array.from(data.value);
    return value.length > 0 ? value.toString() : '(empty set)';
  }
  return '(empty set)';
};

const handleSetIntersectCommand = async (command: string[]) => {
  if (command.length < 2) return 'Error: wrong number of arguments';
  const keys = command.slice(1);
  let data: Entity[] = [];
  for (let i = 0; i < keys.length; i++) {
    const element = await dbService.getData(keys[i]);
    if (typeof element === 'object' && !(element?.value instanceof Set))
      return 'Error: Operation against a key holding the wrong kind of value';
    if (element === null || element === undefined) return '(empty set)';
    if (typeof element === 'string') return 'Error';
    if (!(element.value instanceof Set)) return 'Error';
    data.push(element);
  }
  const setArray = data.map((element) => {
    if (typeof element !== 'string' && element?.value instanceof Set) return element.value;
    const emptySet = new Set([]);
    return emptySet;
  });
  const intersection = setArray.reduce((acc: Set<string>, current: Set<string>): Set<string> => {
    const ans: Set<string> = new Set();
    const valueArray = Array.from(current);
    valueArray.forEach((element) => {
      if (acc.has(element)) ans.add(element);
    });
    return ans;
  });
  if (intersection.size === 0) return '(empty set)';
  return Array.from(intersection).toString();
};

const SetCommand = {
  SADD: handleSetAddCommand,
  SREM: handleSetRemoveCommand,
  SMEMBERS: handleSetMembersCommand,
  SINTER: handleSetIntersectCommand,
};

export default SetCommand;
