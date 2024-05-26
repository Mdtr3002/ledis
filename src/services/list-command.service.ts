import dbService from './db.service';

const handleListPushCommand = async (command: string[]) => {
  if (command.length < 3) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'object' && !Array.isArray(data?.value))
    return 'Error: Operation against a key holding the wrong kind of value';
  if (typeof data === 'string') return 'Error';
  const existingValue =
    data && typeof data == 'object' && Array.isArray(data.value) ? data.value : [];
  const value = [...existingValue, ...command.slice(2)];
  let insertedData;
  if (data && data.expireTime) {
    insertedData = await dbService.addData({ key, value, expireTime: data.expireTime });
  } else insertedData = await dbService.addData({ key, value });
  if (typeof insertedData === 'string' || insertedData === null) return 'Error';
  return Array.isArray(insertedData?.value || '') && !(insertedData?.value instanceof Set)
    ? insertedData.value.length.toString()
    : 'Error';
};

const handleListPopCommand = async (command: string[]) => {
  if (command.length !== 2) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'object' && !Array.isArray(data?.value))
    return 'Error: Operation against a key holding the wrong kind of value';
  if (data === null || data === undefined) return '(nil)';
  if (typeof data === 'string') return 'Error';
  if (Array.isArray(data.value)) {
    if (data.value.length === 0) return '(nil)';
    const returnValue = data.value[data.value.length - 1];
    const value = data.value.slice(0, -1);
    if (data.expireTime) {
      await dbService.addData({ key, value, expireTime: data.expireTime });
    } else await dbService.addData({ key, value: value });
    return returnValue;
  }
  return 'Error';
};

const handleListRangeCommand = async (command: string[]) => {
  if (command.length !== 4) return 'Error: wrong number of arguments';
  const key = command[1];
  const start = parseInt(command[2]);
  const end = parseInt(command[3]);
  if (start < 0 || end < 0 || isNaN(start) || isNaN(end))
    return 'Error: value is not an integer or out of range';
  const data = await dbService.getData(key);
  if (typeof data === 'object' && !Array.isArray(data?.value))
    return 'Error: Operation against a key holding the wrong kind of value';
  if (data === null || data === undefined) return '(empty list)';
  if (typeof data === 'string') return 'Error';
  if (Array.isArray(data.value)) {
    const value = data.value.slice(start, end + 1);
    if (value.length === 0) return '(empty list)';
    return value.toString();
  }
  return 'Error';
};

const ListCommand = {
  RPUSH: handleListPushCommand,
  RPOP: handleListPopCommand,
  LRANGE: handleListRangeCommand,
};

export default ListCommand;
