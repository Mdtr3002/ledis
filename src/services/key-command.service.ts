import dbService from './db.service';

const handleKeyGetCommand = async (command: string[]) => {
  if (command.length !== 1) return 'Error: wrong number of arguments';
  const keys = await dbService.getAllKeys();
  if (typeof keys === 'string' || keys === null) return 'Error';
  return keys.length > 0 ? keys.toString() : '(empty list or set)';
};

const handleKeyDelCommand = async (command: string[]) => {
  if (command.length !== 2) return 'Error: wrong number of arguments';
  const keys = command[1];
  const data = await dbService.deleteKey(keys);
  if (!data) return 'ERROR';
  return 'OK';
};

const KeyCommand = {
  KEYS: handleKeyGetCommand,
  DEL: handleKeyDelCommand,
};

export default KeyCommand;
