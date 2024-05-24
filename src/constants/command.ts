export const StringCommand = ['SET', 'GET'];

export const ListCommand = ['RPUSH', 'RPOP', 'LRANGE'];

export const SetCommand = ['SADD', 'SMEMBERS', 'SREM', 'SINTER'];

export const DataExpireCommand = ['EXPIRE', 'TTL'];

export const KeyCommand = ['DEL', 'KEYS'];

export const SnapshotCommand = ['SAVE', 'RESTORE'];
