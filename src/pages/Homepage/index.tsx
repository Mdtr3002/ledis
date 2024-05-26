import { useEffect, useRef, useState } from 'react';

import RedisIcon from '../../assets/svg/redis_icon.svg';
import { allCommands } from '../../constants/command';
import { DBName, StoreName } from '../../constants/store';
import { useLedis } from '../../hooks/useLedis';

const Homepage = () => {
  const [inputCommand, setInputCommand] = useState<string>('');
  const [commandList, setCommandList] = useState<string[]>([]);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current?.lastElementChild?.scrollIntoView();
    }
  }, [commandList]);

  const ledisClient = useLedis(DBName, StoreName);

  const handleCommand = async () => {
    if (inputCommand === '') return;
    if (inputCommand.toLowerCase() === 'clear') {
      setCommandList([]);
      setInputCommand('');
      return;
    } else if (inputCommand.toLowerCase() === 'tutorial') {
      setCommandList((prev) => [...prev, `>${inputCommand}`, ...allCommands]);
      setInputCommand('');
      return;
    }
    const command = inputCommand.split(' ').filter((item) => item !== '');
    const response = await ledisClient.call(command);
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
      <div className='mt-10 w-full px-5 md:px-10 lg:px-[80px] xl:px-0 xl:w-[60vw]'>
        <div className='w-full bg-[#D82C20] rounded-lg mb-5 p-2 flex flex-col space-y-2'>
          <h2 className='text-white text-[18px]'>
            Welcome to <b>Ledis</b>, a light weight Redis CLI
          </h2>
          <p className='text-white text-[18px]'>
            Please type <b>TUTORIAL</b> view available commands and their functionality.
          </p>
        </div>
        <div
          ref={consoleRef}
          className='w-full bg-gray-200 h-[480px] rounded-t-lg p-2 flex flex-col overflow-y-auto custom-scrollbar'
        >
          {ledisClient.status !== 'ACTIVE' && (
            <div className='h-full w-full flex items-center justify-center'>
              <p className='text-[18px]'>Loading...</p>
            </div>
          )}
          {ledisClient.status === 'ACTIVE' &&
            commandList.map((command, index) => <p key={index}>{command}</p>)}
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
