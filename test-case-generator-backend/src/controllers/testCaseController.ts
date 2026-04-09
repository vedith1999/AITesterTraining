import { Request, Response } from 'express';
import { selectLLMProvider } from '../services/llmService';
import { buildPrompt } from '../utils/promptBuilder';
import { parseAndValidateResponse, TestCase } from '../utils/responseParser';
import { parseInput, normalizeRequirement } from '../services/inputParserService';

interface GenerateTestCasesRequest {
  requirement: string;
  inputFormat: string;
  llmProvider: string;
  includeNonFunctional?: boolean;
  includeEdgeCases?: boolean;
}

export const generateTestCases = async (req: Request, res: Response): Promise<void> => {
  try {
    const { requirement, inputFormat, llmProvider, includeNonFunctional = true, includeEdgeCases = false } = req.body as GenerateTestCasesRequest;

    // Validation
    if (!requirement || !inputFormat || !llmProvider) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Missing required fields: requirement, inputFormat, llmProvider',
        },
      });
      return;
    }

    // Parse input based on format
    const parsedRequirement = parseInput(requirement, inputFormat);
    const normalizedRequirement = normalizeRequirement(parsedRequirement);

    if (!normalizedRequirement) {
      res.status(422).json({
        success: false,
        error: {
          code: 'EMPTY_REQUIREMENT',
          message: 'Requirement is empty after parsing',
        },
      });
      return;
    }

    // Build prompt
    const prompt = buildPrompt(normalizedRequirement, includeNonFunctional, includeEdgeCases);

    // Select LLM provider
    const llmFunction = selectLLMProvider(llmProvider);
    const startTime = Date.now();

    // Call LLM
    let llmResponse: string;
    try {
      llmResponse = await llmFunction(prompt);
    } catch (error) {
      console.error(`${llmProvider} failed, trying fallback...`);
      // Fallback to Ollama
      if (llmProvider !== 'ollama') {
        try {
          const ollamaFunction = selectLLMProvider('ollama');
          llmResponse = await ollamaFunction(prompt);
        } catch (fallbackError) {
          throw new Error('All LLM providers failed');
        }
      } else {
        throw error;
      }
    }

    const endTime = Date.now();
    const generationTime = ((endTime - startTime) / 1000).toFixed(2) + 's';

    // Parse and validate response
    const testCases: TestCase[] = parseAndValidateResponse(llmResponse);

    // Count functional vs non-functional
    const functionalCount = testCases.filter((tc) => tc.type === 'functional').length;
    const nonFunctionalCount = testCases.filter((tc) => tc.type === 'non-functional').length;

    res.status(200).json({
      success: true,
      provider: llmProvider,
      timestamp: new Date().toISOString(),
      testCases: testCases.map((tc) => ({
        ...tc,
        actual: '',
        result: '',
      })),
      totalCount: testCases.length,
      functionalCount,
      nonFunctionalCount,
      generationTime,
    });
  } catch (error) {
    console.error('Error in generateTestCases:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'GENERATION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to generate test cases',
      },
    });
  }
};

export const parseInputEndpoint = (req: Request, res: Response): void => {
  try {
    const { input, format } = req.body;

    if (!input || !format) {
      res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Missing input or format' },
      });
      return;
    }

    const parsed = parseInput(input, format);
    res.status(200).json({
      success: true,
      parsed,
      format,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'PARSE_ERROR',
        message: error instanceof Error ? error.message : 'Failed to parse input',
      },
    });
  }
};

export const getLLMProviders = (req: Request, res: Response): void => {
  const providers = [
    {
      id: 'ollama',
      name: 'Ollama (Local)',
      type: 'local',
      status: 'available',
      configured: true,
    },
    {
      id: 'grow-api',
      name: 'Grow API',
      type: 'cloud',
      status: process.env.GROW_API_KEY ? 'available' : 'unavailable',
      configured: !!process.env.GROW_API_KEY,
    },
    {
      id: 'claude',
      name: 'Claude API',
      type: 'cloud',
      status: process.env.CLAUDE_API_KEY ? 'available' : 'unavailable',
      configured: !!process.env.CLAUDE_API_KEY,
    },
    {
      id: 'gemini',
      name: 'Gemini API',
      type: 'cloud',
      status: process.env.GEMINI_API_KEY ? 'available' : 'unavailable',
      configured: !!process.env.GEMINI_API_KEY,
    },
  ];

  res.status(200).json({
    success: true,
    providers: providers.filter((p) => p.configured),
  });
};
