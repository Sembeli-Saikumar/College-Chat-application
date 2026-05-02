// src/lib/gemini.js
// Gemini AI service using fetch API

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

/**
 * Sends messages to Gemini and returns the AI response.
 * @param {Array} messages - Array of message objects [{role: 'user/assistant', content: '...'}]
 * @returns {Promise<string>} - The AI response text
 */
export async function sendAIMessage(messages) {
  if (!API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables.');
  }

  // System prompt to set the behavior
  const systemContext = `You are a friendly, helpful AI Assistant for college students. 
  Your tone is encouraging, professional yet accessible. 
  Keep responses concise and direct. 
  Help with academic queries, project ideas, and general college life advice.`;

  // Format messages for Gemini API
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const requestBody = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemContext }]
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 800,
    }
  };

  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to fetch response from Gemini');
    }

    const data = await response.json();
    
    // Extract text from Gemini response structure
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini');
    }
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
