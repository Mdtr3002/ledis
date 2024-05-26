import ExpireCommand from './expire-command.service';
import KeyCommand from './key-command.service';
import ListCommand from './list-command.service';
import SetCommand from './set-command.service';
import SnapshotCommand from './snapshot-service';
import StringCommand from './string-command.service';

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

const handleLedisCommand = (command: string[]) => {
  const commandKeyWord: string = command[0].toUpperCase();
  if (commandKeyWord in commandList) return commandList[commandKeyWord](command);
  return 'Unknown Command';
};

export default handleLedisCommand;
