import axios from 'axios';

export type LLMProvider = 'ollama' | 'lmstudio' | 'groq' | 'openai' | 'claude' | 'gemini';

export interface GenerationRequest {
  provider: LLMProvider;
  model: string;
  endpoint?: string;
  apiKey?: string;
  requirements: string;
}

export const generateTestCases = async (request: GenerationRequest): Promise<string> => {
  const { provider, model, endpoint, apiKey, requirements } = request;
  
  const systemPrompt = `You are a Senior QA Engineer. Generate comprehensive functional and non-functional test cases for the given requirements.
Format your output EXACTLY as a JSON array of objects with the following keys:
- "testCaseNumber" (string)
- "testCaseID" (string)
- "scenario" (string)
- "steps" (string)
- "expectedResults" (string)
- "actualResult" (string: leave empty or "N/A")
- "status" (string: "Pass", "Fail", or "N/A")

IMPORTANT: If the user provides a greeting (like "Hi") or does not provide valid requirements that can be tested, you MUST return an empty JSON array: [] . Do not return any conversational text. ONLY JSON.`;

  try {
    switch (provider) {
      case 'ollama':
      case 'lmstudio':
        return await callOpenAICompatible(endpoint || 'http://localhost:11434/v1', model, apiKey || '', systemPrompt, requirements);
      
      case 'groq':
        return await callOpenAICompatible('https://api.groq.com/openai/v1', model, apiKey || '', systemPrompt, requirements);
        
      case 'openai':
        return await callOpenAICompatible('https://api.openai.com/v1', model, apiKey || '', systemPrompt, requirements);
        
      case 'claude':
        return await callAnthropic(apiKey || '', model, systemPrompt, requirements);
        
      case 'gemini':
        return await callGemini(apiKey || '', model, systemPrompt, requirements);
        
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error: any) {
    console.error('LLM Generation Error:', error.response?.data || error.message);
    throw new Error('Failed to generate test cases from LLM');
  }
};

const callOpenAICompatible = async (baseURL: string, model: string, apiKey: string, systemPrompt: string, userPrompt: string) => {
  const url = `${baseURL}/chat/completions`;
  const headers: any = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;

  const response = await axios.post(url, {
    model: model || 'llama3', // default fallback
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2
  }, { headers });

  let content = response.data.choices[0].message.content;
  
  // Clean up any markdown json blocks if they exist
  if (content.startsWith('```json')) {
    content = content.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (content.startsWith('```')) {
    content = content.replace(/^```/, '').replace(/```$/, '').trim();
  }

  return content;
};

const callAnthropic = async (apiKey: string, model: string, systemPrompt: string, userPrompt: string) => {
  const response = await axios.post('https://api.anthropic.com/v1/messages', {
    model: model || 'claude-3-haiku-20240307',
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    max_tokens: 4000
  }, {
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    }
  });
  return response.data.content[0].text;
};

const callGemini = async (apiKey: string, model: string, systemPrompt: string, userPrompt: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
  const response = await axios.post(url, {
    system_instruction: { parts: { text: systemPrompt } },
    contents: [{ parts: [{ text: userPrompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
  
  return response.data.candidates[0].content.parts[0].text;
};
