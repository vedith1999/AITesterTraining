# Findings

## Research
- The application will be a web application (React frontend, Node.js/TypeScript backend).
- Core function: Generate functional and non-functional test cases (web application & API).
- Integrations: Ollama API, LM Studio API, Grok API, OpenAI, Claude API, Gemini API.

## Discoveries
- **Inputs:** Jira requirements (or text representation), attached documents, typed/pasted chat requirements.
- **Outputs:** Plain text descriptions and structured JSON test cases.
- **Test Case Fields:** Test case number, ID, scenario, steps, expected results, actual result, test case result (pass/fail).
- **Format:** Final output should be in a Jira format.
- **UI:** Must match the provided `Design.png`.

## Constraints
- No code or scripts to be written until the blueprint in `task_plan.md` is approved.
