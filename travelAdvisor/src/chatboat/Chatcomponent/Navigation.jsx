import React from 'react';

const Navigation = () => {
  return (
    <nav className='flex flex-row items-center w-full max-w-4xl mb-10 p-3 sm:p-4 '>
      <div className='absolute left-0 ml-2 pl-1'>
        <h1 className='text-lg sm:text-xl md:text-2xl font-bold text-zinc-400 mt-5'>
          TravelAdvisor
        </h1>
        <div className='h-5 sm:h-7 px-2 sm:px-3 rounded-lg text-xs mt-1 text-zinc-400 font-bold flex items-center justify-center bg-zinc-400/20'>
          ask me...
        </div>
      </div>
      <div className='flex items-center gap-3 absolute right-0 pr-1 mr-2 mt-4'>
        {/* <div className='h-6 sm:h-7 px-2 sm:px-3 rounded-lg text-xs text-zinc-400 font-bold flex items-center justify-center bg-zinc-400/20'>
          PR0
        </div> */}
        <div className='bg-blue-500 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-white text-sm sm:text-xl'>
          T.M
        </div>
      </div>
    </nav>
  );
};

export default Navigation;