import dbService from './db.service';

const handleSetExpireCommand = async (command: string[]) => {
  if (command.length !== 3) return 'Error: wrong number of arguments';
  const key = command[1];
  const expireTime = parseInt(command[2]);
  if (isNaN(expireTime)) return 'Error: value is not an integer or out of range';
  const data = await dbService.getData(key);
  if (typeof data === 'object' && data !== null) {
    if (expireTime <= 0) {
      const data = await dbService.deleteKey(key);
      if (!data) return 'Error';
      return '1';
    }
    const currentTime = new Date();
    const expireDate = new Date(currentTime.getTime() + expireTime * 1000);
    data.expireTime = expireDate;
    const insertedData = await dbService.addData(data);
    if (typeof insertedData === 'string' || insertedData === null) return 'Error';
    return expireTime.toString();
  }
  return '0';
};

const handleTTLCommand = async (command: string[]) => {
  if (command.length !== 2) return 'Error: wrong number of arguments';
  const key = command[1];
  const data = await dbService.getData(key);
  if (typeof data === 'object' && data !== null) {
    if (data.expireTime === undefined || !(data.expireTime instanceof Date)) return '-1';
    const currentTime = new Date();
    const expireTime = new Date(data.expireTime);
    const diff = Math.floor((expireTime.getTime() - currentTime.getTime()) / 1000);
    return diff.toString();
  }
  return '-2';
};

const ExpireCommand = {
  EXPIRE: handleSetExpireCommand,
  TTL: handleTTLCommand,
};

export default ExpireCommand;
