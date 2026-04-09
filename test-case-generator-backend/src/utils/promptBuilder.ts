export const buildPrompt = (requirement: string, includeNonFunctional: boolean = true, includeEdgeCases: boolean = false): string => {
  return `You are an expert QA engineer. Generate comprehensive test cases for the following requirement:

Requirement: "${requirement}"

Generate test cases in the following VALID JSON format (no markdown, just JSON):
[
  {
    "number": "TC-001",
    "name": "Test case name",
    "scenario": "Scenario description",
    "description": "What is being tested",
    "steps": ["Step 1", "Step 2", "Step 3"],
    "acceptance": "Acceptance criteria",
    "expected": "Expected results",
    "type": "functional"
  }
]

Requirements:
1. Generate 3-5 test cases
2. Include BOTH functional test cases (feature behavior)${includeNonFunctional ? ' AND non-functional test cases (performance, security, usability)' : ''}
3. Each test case must have ALL fields: number, name, scenario, description, steps (array), acceptance, expected, type
4. Use "functional" or "non-functional" for type field
5. Number test cases sequentially: TC-001, TC-002, TC-003, etc.
6. Make test steps clear and actionable (array of strings)${includeEdgeCases ? '\n7. Include edge cases and boundary conditions' : ''}
8. Return ONLY valid JSON, no additional text or markdown

Generate the test cases now:`;
};
