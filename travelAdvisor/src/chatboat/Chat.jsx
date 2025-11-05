import '../App'
import { useState, useEffect } from 'react'
import React from 'react'
import Navigation from '../chatboat/Chatcomponent/Navigation'
import ChatContainer from '../chatboat/Chatcomponent/ChatContainer'
import ChatInput from '../chatboat/Chatcomponent/ChatInput'
import { useGeminiAPI } from './useGeminiAPI'
import GeminiLogo from '../assets/Gemini.png'
import Navbar from '../Scomponent/Navbar'

function Chat() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const { isLoading, sendMessage, stopResponse } = useGeminiAPI();

  useEffect(() => {
    const img = new Image();
    img.src = GeminiLogo;
    
    // Apply global scrollbar removal
    const styleId = 'global-scrollbar-removal';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
          width: 0px;
          background: transparent;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setConversation(prev => [...prev, { type: 'user', content: userMessage }]);
    setInput('');
    
    sendMessage(
      userMessage,
      (response) => {
        setConversation(prev => [...prev, { type: 'ai', content: response }]);
      },
      (errorMessage) => {
        setConversation(prev => [...prev, { type: 'ai', content: errorMessage }]);
      }
    );
  };

  return (
    <div className='bigContainer h-screen bg-zinc-900 p-2 sm:p-4 flex flex-col overflow-none'>
      <Navbar />
      <Navigation />
      <ChatContainer conversation={conversation} isLoading={isLoading} />
      <ChatInput 
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onStop={stopResponse}
      />
    </div>
  )
}

export default Chat
