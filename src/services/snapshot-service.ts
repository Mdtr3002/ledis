import dbService from './db.service';

const handleSaveSnapshotCommand = async (command: string[]) => {
  if (command.length !== 1) return 'Error: wrong number of arguments';
  const data = await dbService.saveSnapshot();
  if (typeof data === 'string') return 'Error';
  return 'OK';
};

const handleRestoreSnapshotCommand = async (command: string[]) => {
  if (command.length !== 1) return 'Error: wrong number of arguments';
  const data = await dbService.restoreSnapshot();
  if (typeof data === 'string') return 'Error';
  return 'OK';
};

const SnapshotCommand = {
  SAVE: handleSaveSnapshotCommand,
  RESTORE: handleRestoreSnapshotCommand,
};

export default SnapshotCommand;
