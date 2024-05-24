import { Entity } from '../types/entity';

import dbService from './db.service';

const handleStringSetCommand = async (command: string[]) => {
  if (command.length > 3) return 'Syntax Error';
  if (command.length === 1) return 'OK';
  const key = command[1];
  const value = command.length === 2 ? '' : command[2];
  const data: Entity = { key, value };
  await dbService.addData(data);
  return 'OK';
};

const handleStringGetCommand = async (command: string[]) => {
  if (command.length !== 2) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'string') return data;
  else if (data === undefined || data === null) return '(nil)';
  else if (typeof data === 'object' && typeof data?.value != 'string')
    return 'Error: Operation against a key holding the wrong kind of value';
  return '"' + data.value.toString() + '"';
};

const StringCommand = {
  SET: handleStringSetCommand,
  GET: handleStringGetCommand,
};

export default StringCommand;
