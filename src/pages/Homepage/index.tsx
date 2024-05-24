import { useEffect, useState } from 'react';

import RedisIcon from '../../assets/svg/redis_icon.svg';
import handleLedisCommand from '../../services/command.service';
import dbService from '../../services/db.service';

const Homepage = () => {
  const [inputCommand, setInputCommand] = useState<string>('');
  const [commandList, setCommandList] = useState<string[]>(['>SET key value', 'OK']);
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  console.log(isDBReady);

  const handleInitDB = async () => {
    const status = await dbService.initDB();
    setIsDBReady(status);
  };

  useEffect(() => {
    handleInitDB();
  }, []);

  const handleCommand = async () => {
    if (inputCommand === '') return;
    if (inputCommand.toLowerCase() === 'clear') {
      setCommandList([]);
      setInputCommand('');
      return;
    }
    const command = inputCommand.split(' ').filter((item) => item !== '');
    const response = await handleLedisCommand(command);
    setCommandList((prev) => [...prev, `>${inputCommand}`, response]);
    setInputCommand('');
  };

  return (
    <div className='my-5 flex flex-col items-center w-full'>
      <div className='flex items-center justify-center space-x-2'>
        <img src={RedisIcon} alt='Redis Icon' className='w-20 h-20' />
        <div className='flex flex-col space-y-1'>
          <h1 className='text-2xl md:text-3xl xl:text-4xl font-bold text-[#D82C20]'>Ledis</h1>
          <p>Light weight Redis CLI</p>
        </div>
      </div>
      <div className='mt-10 w-full px-5 md:px-10 lg:px-[80px] xl:px-0 xl:w-[50vw]'>
        <div className='w-full bg-gray-200 h-[400px] rounded-t-lg p-2 flex flex-col overflow-y-auto custom-scrollbar'>
          {commandList.map((command, index) => (
            <p key={index}>{command}</p>
          ))}
        </div>
        <div className='w-full bg-black rounded-b-lg p-2 text-white flex space-x-1'>
          <p>{'>'}Ledis:</p>
          <input
            type='text'
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCommand();
            }}
            className='w-full bg-transparent outline-none'
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
