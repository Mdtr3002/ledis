export const StringCommand = ['SET', 'GET'];

export const ListCommand = ['RPUSH', 'RPOP', 'LRANGE'];

export const SetCommand = ['SADD', 'SMEMBERS', 'SREM', 'SINTER'];

export const DataExpireCommand = ['EXPIRE', 'TTL'];

export const KeyCommand = ['DEL', 'KEYS'];

export const SnapshotCommand = ['SAVE', 'RESTORE'];

export const allCommands = [
  '• SET key value: set a string value, overwriting what is saved under key',
  '• GET key: get a string value at key',
  '• DEL key: Delete a key',
  '• RPUSH key value1 [value2...]: append 1 or more values to the list, create a new list if not exists, return the length of the list after the operation',
  '• RPOP key: remove and return the last item of the list',
  '• LRANGE key start stop: return a range of elements from the list (zero-based, inclusive of start and stop), start and stop are non-negative integers',
  '• SADD key value1 [value2...]: add values to the set stored at key',
  '• SREM key value1 [value2...]: remove values from the set stored at key',
  '• SMEMBERS key: return an array of all members of the set stored at key',
  '• SINTER [key1] [key2] [key3] ...: build a set that is the intersection of all sets stored in specified keys. Return array of members of the result set',
  '• KEYS: List all available keys',
  '• DEL key: delete a key',
  '• EXPIRE key seconds: set a timeout on a key, seconds is a positive integer (by default a key has no expiration). Return the number of seconds if the timeout is set',
  '• TTL key: query the timeout of a key',
  '• SAVE: save the current state in a snapshot',
  '• RESTORE: restore the state from the last snapshot',
  '• CLEAR: Clear the console',
  '• TUTORIAL: View available commands and their functionality',
];
