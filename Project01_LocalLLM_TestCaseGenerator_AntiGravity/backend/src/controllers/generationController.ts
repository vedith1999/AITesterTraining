import { Request, Response } from 'express';
import { generateTestCases } from '../services/llmService';

export const handleGenerate = async (req: Request, res: Response) => {
  try {
    const { provider, model, endpoint, apiKey, requirements } = req.body;

    if (!provider || !requirements) {
      return res.status(400).json({ error: 'Provider and requirements are required' });
    }

    const rawResponse = await generateTestCases({
      provider,
      model,
      endpoint,
      apiKey,
      requirements
    });

    let testCases = [];
    try {
      const match = rawResponse.match(/\[[\s\S]*\]/);
      const jsonStr = match ? match[0] : rawResponse;
      testCases = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse LLM response as JSON', rawResponse);
      return res.status(500).json({ 
        error: 'LLM generated invalid JSON format', 
        rawResponse 
      });
    }

    res.json({ testCases });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const handleTestConnection = async (req: Request, res: Response) => {
  try {
    const { provider, model, endpoint, apiKey } = req.body;
    
    // Quick test prompt
    await generateTestCases({
      provider,
      model,
      endpoint,
      apiKey,
      requirements: "Reply with the word OK."
    });

    res.json({ status: 'OK' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Connection failed' });
  }
};
