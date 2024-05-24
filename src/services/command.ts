import { ListCommand, StringCommand } from '../constants/command';
import { Entity } from '../types/entity';

import dbService from './db';

const handleDelisCommand = async (command: string[]) => {
  const commandKeyWord = command[0].toUpperCase();
  if (StringCommand.includes(commandKeyWord)) {
    if (commandKeyWord === 'SET') {
      if (command.length > 3) return 'Syntax Error';
      const key = command[1];
      const value = command.length === 2 ? '' : command[2];
      const data: Entity = { key, value };
      await dbService.addData(data);
      return 'OK';
    } else if (commandKeyWord === 'GET') {
      if (command.length !== 2) return 'Error: wrong number of arguments';
      const key = command[1];
      const data = await dbService.getData(key);
      if (typeof data === 'string') return data;
      else if (data === undefined || data === null) return '(nil)';
      else if (typeof data === 'object' && typeof data?.value != 'string')
        return 'Error: Operation against a key holding the wrong kind of value';
      return '"' + data.value.toString() + '"';
    }
  } else if (ListCommand.includes(commandKeyWord)) {
    if (commandKeyWord === 'RPUSH') {
      if (command.length < 3) return 'Error: wrong number of arguments';
      const key = command[1];
      const data = await dbService.getData(key);
      if (typeof data === 'object' && typeof data?.value === 'string')
        return 'Error: Operation against a key holding the wrong kind of value';
      if (data === null || typeof data === 'string') return 'Error';
      const existingValue =
        typeof data == 'object' && typeof data.value !== 'string' ? data.value : [];
      const value = [...existingValue, ...command.slice(2)];
      const insertedData = await dbService.addData({ key, value });
      if (typeof insertedData === 'string' || insertedData === null) return 'Error';
      return Array.isArray(insertedData?.value || '')
        ? insertedData.value.length.toString()
        : 'Error';
    } else if (commandKeyWord === 'RPOP') {
      if (command.length !== 2) return 'Error: wrong number of arguments';
      const key = command[1];
      const data = await dbService.getData(key);
      if (typeof data === 'object' && typeof data?.value === 'string')
        return 'Error: Operation against a key holding the wrong kind of value';
      if (data === null || data === undefined) return '(nil)';
      if (typeof data === 'string') return 'Error';
      if (Array.isArray(data.value)) {
        if (data.value.length === 0) return '(nil)';
        const returnValue = data.value[data.value.length - 1];
        const value = data.value.slice(0, -1);
        await dbService.addData({ key, value: value });
        return returnValue;
      }
      return 'Error';
    } else if (commandKeyWord === 'LRANGE') {
      if (command.length !== 4) return 'Error: wrong number of arguments';
      const key = command[1];
      const start = parseInt(command[2]);
      const end = parseInt(command[3]);
      if (start < 0 || end < 0 || isNaN(start) || isNaN(end))
        return 'Error: value is not an integer or out of range';
      const data = await dbService.getData(key);
      if (typeof data === 'object' && typeof data?.value === 'string')
        return 'Error: Operation against a key holding the wrong kind of value';
      if (data === null || data === undefined) return '(empty list)';
      if (typeof data === 'string') return 'Error';
      if (Array.isArray(data.value)) {
        const value = data.value.slice(start, end + 1);
        if (value.length === 0) return '(empty list)';
        return value.toString();
      }
    }
    return 'List Command';
  }
  return 'Delis Command';
};

export default handleDelisCommand;
