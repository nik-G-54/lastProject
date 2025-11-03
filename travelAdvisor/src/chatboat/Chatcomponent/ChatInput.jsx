import React from 'react';

const ChatInput = ({ 
  input, 
  setInput, 
  onSubmit, 
  isLoading, 
  onStop 
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isLoading) {
        onStop();
      } else {
        onSubmit();
      }
    }
  };

  return (
    <div className='bg-zinc-800 w-full max-w-4xl h-16 sm:h-20 text-white mx-auto rounded-2xl border border-zinc-400 flex items-center justify-center p-2 sm:p-3 flex-shrink-0 shadow-[-2px_-8px_10px_-3px_rgba(0,0,0,0.3)]'>
      <input 
        type="text" 
        placeholder='Ask me ...' 
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className='w-full h-full bg-transparent outline-none p-1 sm:p-2 resize-none placeholder-zinc-300 disabled:opacity-50 text-1.5xl sm:text-1.5xl' 
      />
      <button 
        type='submit' 
        onClick={isLoading ? onStop : onSubmit}
        disabled={!isLoading && !input.trim()}
        className='ml-2 sm:ml-3 px-3 sm:px-4 py-2 sm:py-3 bg-zinc-600 disabled:bg-zinc-600 disabled:cursor-not-allowed cursor-pointer rounded-lg transition-colors text-white hover:bg-zinc-700 flex items-center justify-center'
        title={isLoading ? 'Stop generation' : 'Send message'}
      >
        {isLoading ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="6" width="12" height="12" fill="currentColor" rx="2"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" fill="currentColor"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput;
