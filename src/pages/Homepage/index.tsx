import RedisIcon from '../../assets/svg/redis_icon.svg';

const Homepage = () => {
  return (
    <div className='flex items-center justify-center space-x-2 mt-5'>
      <img src={RedisIcon} alt='Redis Icon' className='w-20 h-20' />
      <div className='flex flex-col space-y-1'>
        <h1 className='text-2xl font-bold text-[#D82C20]'>Ledis</h1>
        <p>Light weight Redis CLI</p>
      </div>
    </div>
  );
};

export default Homepage;
