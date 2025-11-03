import { useState, useCallback } from 'react';
import { geminiService } from './geminiService';

export const useGeminiAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [abortController, setAbortController] = useState(null);

  const sendMessage = useCallback(async (message, onSuccess, onError) => {
    if (!message.trim()) return;

    setIsLoading(true);
    
    // Create AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await geminiService.sendMessage(message, controller.signal);
      onSuccess(response);
    } catch (error) {
      if (error.message === 'ABORTED') {
        onError('You stopped this response.');
      } else {
        onError('Error: Unable to get response. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, []);

  const stopResponse = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);
    }
  }, [abortController]);

  return {
    isLoading,
    sendMessage,
    stopResponse
  };
};