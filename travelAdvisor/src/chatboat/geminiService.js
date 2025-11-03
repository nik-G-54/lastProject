import { API_URL } from '../assets/constants';

export const geminiService = {
  // Send message to Gemini API
  async sendMessage(message, abortSignal) {
    const payload = {
      "contents": [{
        "parts": [{ "text": message }]
      }]
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        },
        signal: abortSignal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates[0].content.parts[0].text;
      
      console.log('Response received:', responseText);
      return responseText;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        throw new Error('ABORTED');
      } else {
        console.error('Error fetching data:', error);
        throw new Error('API_ERROR');
      }
    }
  }
};