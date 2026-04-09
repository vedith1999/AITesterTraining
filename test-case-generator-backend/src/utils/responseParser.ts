export interface TestCase {
  number: string;
  name: string;
  scenario: string;
  description: string;
  steps: string[];
  acceptance: string;
  expected: string;
  actual: string;
  result: string;
  type: 'functional' | 'non-functional';
}

export const parseAndValidateResponse = (response: string): TestCase[] => {
  try {
    // Try to extract JSON from the response
    let jsonStr = response;
    
    // If response contains markdown code blocks, extract the JSON
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    // Try to find JSON array
    const arrayMatch = jsonStr.match(/\[[\s\S]*\]/);
    if (!arrayMatch) {
      throw new Error('No JSON array found in response');
    }

    const parsed = JSON.parse(arrayMatch[0]);
    
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }

    // Validate and normalize each test case
    const testCases: TestCase[] = parsed.map((tc: any, index: number) => {
      if (!tc.number || !tc.name || !tc.scenario || !tc.steps) {
        console.warn(`Test case ${index} missing required fields`);
      }

      return {
        number: tc.number || `TC-${String(index + 1).padStart(3, '0')}`,
        name: tc.name || 'Unnamed Test Case',
        scenario: tc.scenario || '',
        description: tc.description || '',
        steps: Array.isArray(tc.steps) ? tc.steps : [tc.steps || ''],
        acceptance: tc.acceptance || '',
        expected: tc.expected || '',
        actual: tc.actual || '',
        result: tc.result || '',
        type: (tc.type === 'non-functional' ? 'non-functional' : 'functional') as 'functional' | 'non-functional',
      };
    });

    return testCases;
  } catch (error) {
    console.error('Error parsing response:', error, 'Response:', response);
    throw new Error(`Failed to parse LLM response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
