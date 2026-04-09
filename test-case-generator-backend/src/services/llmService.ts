import axios from 'axios';

// Ollama Service
export const callOllama = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: process.env.OLLAMA_MODEL || 'mistral',
      prompt: prompt,
      stream: false,
    }, {
      timeout: 30000,
    });

    return response.data.response || '';
  } catch (error) {
    console.error('Ollama error:', error);
    throw new Error('Failed to call Ollama');
  }
};

// Grow API Service
export const callGrowAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post('https://api.grow.com/v1/generate', {
      prompt: prompt,
      max_tokens: 2000,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.GROW_API_KEY}`,
      },
      timeout: 30000,
    });

    return response.data.choices?.[0]?.text || '';
  } catch (error) {
    console.error('Grow API error:', error);
    throw new Error('Failed to call Grow API');
  }
};

// Claude API Service (Optional)
export const callClaude = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }, {
      headers: {
        'x-api-key': process.env.CLAUDE_API_KEY || '',
      },
      timeout: 30000,
    });

    return response.data.content?.[0]?.text || '';
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to call Claude API');
  }
};

// Gemini API Service (Optional)
export const callGemini = async (prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      { timeout: 30000 }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to call Gemini API');
  }
};

export const selectLLMProvider = (provider: string) => {
  switch (provider) {
    case 'ollama':
      return callOllama;
    case 'grow-api':
      return callGrowAPI;
    case 'claude':
      return callClaude;
    case 'gemini':
      return callGemini;
    default:
      return callOllama;
  }
};
