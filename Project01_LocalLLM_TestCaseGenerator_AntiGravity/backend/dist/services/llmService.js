"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestCases = void 0;
const axios_1 = __importDefault(require("axios"));
const generateTestCases = async (request) => {
    const { provider, model, endpoint, apiKey, requirements } = request;
    const systemPrompt = `You are a Senior QA Engineer. Generate comprehensive functional and non-functional test cases for the given requirements.
Format your output EXACTLY as a JSON array of objects with the following keys:
- "testCaseNumber" (string)
- "testCaseID" (string)
- "scenario" (string)
- "steps" (string)
- "expectedResults" (string)
- "actualResult" (string: leave empty or "N/A")
- "status" (string: "Pass", "Fail", or "N/A")`;
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
    }
    catch (error) {
        console.error('LLM Generation Error:', error.response?.data || error.message);
        throw new Error('Failed to generate test cases from LLM');
    }
};
exports.generateTestCases = generateTestCases;
const callOpenAICompatible = async (baseURL, model, apiKey, systemPrompt, userPrompt) => {
    const url = `${baseURL}/chat/completions`;
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey)
        headers['Authorization'] = `Bearer ${apiKey}`;
    const response = await axios_1.default.post(url, {
        model: model || 'llama3', // default fallback
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' } // Help enforce JSON if supported
    }, { headers });
    return response.data.choices[0].message.content;
};
const callAnthropic = async (apiKey, model, systemPrompt, userPrompt) => {
    const response = await axios_1.default.post('https://api.anthropic.com/v1/messages', {
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
const callGemini = async (apiKey, model, systemPrompt, userPrompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
    const response = await axios_1.default.post(url, {
        system_instruction: { parts: { text: systemPrompt } },
        contents: [{ parts: [{ text: userPrompt }] }],
        generationConfig: { responseMimeType: 'application/json' }
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data.candidates[0].content.parts[0].text;
};
