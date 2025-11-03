import React from 'react';
import GeminiLogo from '../../assets/Gemini.png';

const renderFormattedText = (text) => {
  if (!text) return null;
  
  const parts = text.split(/\n\s*\n/);
  
  return parts.map((part, partIndex) => {
    if (!part.trim()) return null;
  
    const lines = part.split('\n').filter(line => line.trim());
    
    return (
      <div key={partIndex} className="mb-6 last:mb-0">
        {lines.map((line, lineIndex) => {
          const trimmedLine = line.trim();
          
          const isHeading = /\*\*.*\*\*/.test(trimmedLine) || 
                           (/^#{1,3}\s/.test(trimmedLine)) ||
                           (trimmedLine.length < 80 && 
                            (trimmedLine.endsWith(':') || 
                             /^[A-Z][^.]*:?$/.test(trimmedLine)));
          
          const isBulletPoint = /^[*\-•]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine);
    
          let cleanText = trimmedLine
            .replace(/\*\*/g, '') 
            .replace(/^[*\-•]\s/, '')
            .replace(/^#{1,3}\s/, '') 
            .replace(/^\d+\.\s/, '');
          
          if (isHeading) {
            return (
              <h3 key={lineIndex} className="text-white font-semibold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 mt-2 sm:mt-4 first:mt-0">
                {cleanText}
              </h3>
            );
          } else if (isBulletPoint) {
            return (
              <div key={lineIndex} className="flex items-start mb-2">
                <span className="text-gray-400 mr-3 mt-1">•</span>
                <p className="text-gray-200 leading-relaxed flex-1 text-xs sm:text-sm">
                  {cleanText}
                </p>
              </div>
            );
          } else {
            return (
              <p key={lineIndex} className="text-gray-200 leading-relaxed mb-2 sm:mb-3 text-xs sm:text-sm">
                {cleanText}
              </p>
            );
          }
        })}
      </div>
    );
  });
};

const ChatContainer = ({ conversation, isLoading }) => {
  return (
    <div className='container w-full max-w-4xl flex-1 text-white mx-auto rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-3 sm:mb-4 overflow-y-auto scrollbar-hide backdrop-blur-sm'>
      {conversation.length === 0 && !isLoading ? (
        <div className='flex flex-col items-center h-full'>
          <h1 className='bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent text-xl sm:text-4xl md:text-4xl text-center px-4 font-semibold'>
            Explore...
          </h1>
          <h1 className='text-zinc-400 text-xl sm:text-3xl md:text-4xl text-center px-4'>
            What should you planning for today...?
          </h1>
        </div>
      ) : (
        <div className='w-full h-full space-y-6'>
          {conversation.map((message, index) => (
            <div key={index} className={`flex w-full ${
              message.type === 'user' ? 'justify-end' : 'justify-start'
            }`}>
              {message.type === 'user' ? (
                <div className='max-w-2xl'>
                  <div className='bg-zinc-700 text-white rounded-2xl rounded-tr-md px-4 py-3'>
                    <p className='text-lg sm:text-lg leading-relaxed whitespace-pre-wrap'>
                      {message.content}
                    </p>
                  </div>
                  <div className='text-xs text-zinc-500 mt-1 text-right'>You</div>
                </div>
              ) : (
                <div className='max-w-4xl flex flex-row items-start gap-1'>
                  <img 
                    src={GeminiLogo} 
                    alt="Gemini Logo" 
                    className="w-6 h-6 sm:w-8 sm:h-8 mt-3 flex-shrink-0"
                  />
                  <div className='text-gray-200 rounded-2xl rounded-tl-md px-3 sm:px-6 py-3 sm:py-4 flex-1'>
                    <div className='prose prose-invert max-w-none'>
                      {renderFormattedText(message.content)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className='flex justify-start'>
              <div className='max-w-4xl'>
                <div className='bg-zinc-800/50 border border-zinc-700/50 text-gray-200 rounded-2xl rounded-tl-md px-6 py-4 shadow-lg'>
                  <div className='flex items-center space-x-3'>
                    <div className='animate-spin w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full'></div>
                    <span className='text-zinc-400 text-xs sm:text-sm'>chatboat is thinking...</span>
                  </div>
                </div>
                <div className='text-xs text-zinc-500 mt-1'></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
