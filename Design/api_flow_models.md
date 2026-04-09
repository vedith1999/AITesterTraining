# API Flow & Data Models: AI Test Case Generator

## Complete API Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  User Input: Requirement + File + LLM Provider Selection                 │
│                              │                                             │
│                              ▼                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │           Frontend Validation & Preprocessing                        │ │
│  │  - Check input not empty                                            │ │
│  │  - Validate file size (< 10MB)                                      │ │
│  │  - Check LLM provider selection                                     │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                              │                                             │
│                              ▼ (Valid)                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  POST /api/generate-test-cases                                       │ │
│  │  Request Payload:                                                    │ │
│  │  {                                                                   │ │
│  │    "requirement": "string or file content",                         │ │
│  │    "inputFormat": "text|document|json|markdown",                    │ │
│  │    "llmProvider": "ollama|grow-api|claude|gemini",                 │ │
│  │    "includeNonFunctional": true,                                   │ │
│  │    "includeEdgeCases": false                                       │ │
│  │  }                                                                   │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
│                              │                                             │
└──────────────────────────────┼─────────────────────────────────────────────┘
                               │ HTTP POST
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                            BACKEND (Express)                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─ Request Middleware ──────────────────────────────────────────────┐   │
│  │ - validateRequest()    ✓ Check all fields exist                  │   │
│  │ - sanitizeInput()      ✓ Remove malicious content               │   │
│  │ - checkRateLimit()     ✓ Rate limiting (100 req/min)            │   │
│  │                                                                   │   │
│  │ Result: If validation fails → 400/422 error response            │   │
│  └─ Continue if valid ──────────────────────────────────────────────┘   │
│                              │                                            │
│                              ▼                                            │
│  ┌─ Input Processing ────────────────────────────────────────────────┐   │
│  │ parseInput() function:                                            │   │
│  │                                                                   │   │
│  │ ├─ If format === "document":                                     │   │
│  │ │  └─ readFileContent() & extractText() & parseMarkdown()       │   │
│  │ │                                                                 │   │
│  │ ├─ If format === "json":                                         │   │
│  │ │  └─ parseJSON() & validateSchema()                            │   │
│  │ │                                                                 │   │
│  │ ├─ If format === "text" or "markdown":                           │   │
│  │ │  └─ normalizeText() & extractKeywords()                       │   │
│  │ │                                                                 │   │
│  │ └─ Return: cleanedRequirement: string                            │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
│                              ▼                                            │
│  ┌─ LLM Provider Selection ──────────────────────────────────────────┐   │
│  │ selectLLMProvider(provider) logic:                                │   │
│  │                                                                   │   │
│  │ switch(provider) {                                               │   │
│  │   case 'ollama':      use OllamaService                          │   │
│  │   case 'grow-api':    use GrowApiService                         │   │
│  │   case 'claude':      use ClaudeService                          │   │
│  │   case 'gemini':      use GeminiService                          │   │
│  │   default:            fallback to Ollama                         │   │
│  │ }                                                                 │   │
│  │                                                                   │   │
│  │ Check provider availability:                                     │   │
│  │   - Ollama: curl localhost:11434/api/tags                       │   │
│  │   - Others: check API key in environment                        │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
│                              ▼                                            │
│  ┌─ Prompt Engineering ──────────────────────────────────────────────┐   │
│  │ buildPrompt() function:                                           │   │
│  │                                                                   │   │
│  │ Template:                                                         │   │
│  │ """                                                               │   │
│  │ You are an expert QA engineer. Generate comprehensive test       │   │
│  │ cases for the following requirement:                             │   │
│  │                                                                   │   │
│  │ Requirement: {cleanedRequirement}                                │   │
│  │                                                                   │   │
│  │ Generate test cases in the following JSON format:                │   │
│  │ [                                                                 │   │
│  │   {                                                               │   │
│  │     "number": "TC-001",                                          │   │
│  │     "name": "...",                                               │   │
│  │     "scenario": "...",                                           │   │
│  │     "description": "...",                                        │   │
│  │     "steps": ["step1", "step2", ...],                           │   │
│  │     "acceptance": "...",                                         │   │
│  │     "expected": "...",                                           │   │
│  │     "type": "functional|non-functional"                          │   │
│  │   }                                                               │   │
│  │ ]                                                                 │   │
│  │                                                                   │   │
│  │ Include both functional and non-functional test cases.          │   │
│  │ """                                                               │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
│                              ▼                                            │
│  ┌─ LLM API Call ────────────────────────────────────────────────────┐   │
│  │ callLLM(prompt, provider):                                        │   │
│  │                                                                   │   │
│  │ ┌─ OLLAMA ──────────────────────────────────────────────────┐   │   │
│  │ │ POST http://localhost:11434/api/generate                │   │   │
│  │ │ {                                                        │   │   │
│  │ │   "model": "mistral" or "neural-chat",                 │   │   │
│  │ │   "prompt": "{prompt}",                                │   │   │
│  │ │   "stream": false                                      │   │   │
│  │ │ }                                                        │   │   │
│  │ │ Timeout: 30s                                           │   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │ ┌─ GROW API ────────────────────────────────────────────────┐   │   │
│  │ │ POST https://api.grow.com/v1/generate                  │   │   │
│  │ │ Headers: Authorization: Bearer {API_KEY}               │   │   │
│  │ │ Body: {                                                │   │   │
│  │ │   "prompt": "{prompt}",                               │   │   │
│  │ │   "max_tokens": 2000,                                 │   │   │
│  │ │   "temperature": 0.7                                  │   │   │
│  │ │ }                                                        │   │   │
│  │ │ Timeout: 30s                                           │   │   │
│  │ └────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │ ┌─ CLAUDE/GEMINI ───────────────────────────────────────────┐   │   │
│  │ │ Similar structure with respective API endpoints          │   │   │
│  │ │ Headers: API key authentication                          │   │   │
│  │ │ Timeout: 30s                                             │   │   │
│  │ └────────────────────────────────────────────────────────────┘   │   │
│  │                                                                   │   │
│  │ On Timeout/Error:                                               │   │
│  │   → Try fallback provider                                       │   │
│  │   → Return error if all providers fail                          │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
│                              ▼ (LLM Response)                             │
│  ┌─ Parse & Validate Response ──────────────────────────────────────┐   │
│  │ parseResponse() function:                                         │   │
│  │                                                                   │   │
│  │ 1. Extract JSON from response                                    │   │
│  │ 2. Validate against TestCase schema                             │   │
│  │ 3. Ensure all required fields present                           │   │
│  │ 4. Validate field formats (number, string, array, etc.)        │   │
│  │ 5. Clean and standardize test case data                         │   │
│  │                                                                   │   │
│  │ If validation fails:                                             │   │
│  │   → Try parsing with alternative methods                        │   │
│  │   → Return partial results if possible                          │   │
│  │   → Add errors to response                                      │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
│                              ▼                                            │
│  ┌─ Format Response ──────────────────────────────────────────────┐   │
│  │ buildResponse() function:                                        │   │
│  │                                                                   │   │
│  │ Return JSON:                                                     │   │
│  │ {                                                                 │   │
│  │   "success": true,                                              │   │
│  │   "provider": "ollama",                                         │   │
│  │   "timestamp": "2026-03-10T12:34:56Z",                         │   │
│  │   "testCases": [                                                │   │
│  │     {                                                            │   │
│  │       "number": "TC-001",                                       │   │
│  │       "name": "...",                                            │   │
│  │       "scenario": "...",                                        │   │
│  │       "description": "...",                                     │   │
│  │       "steps": [...],                                           │   │
│  │       "acceptance": "...",                                      │   │
│  │       "expected": "...",                                        │   │
│  │       "actual": "",                                             │   │
│  │       "result": "",                                             │   │
│  │       "type": "functional"                                      │   │
│  │     }                                                            │   │
│  │   ],                                                             │   │
│  │   "totalCount": 5,                                              │   │
│  │   "functionalCount": 3,                                         │   │
│  │   "nonFunctionalCount": 2,                                      │   │
│  │   "generationTime": "2.5s"                                      │   │
│  │ }                                                                 │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                              │                                            │
└──────────────────────────────┼────────────────────────────────────────────┘
                               │ HTTP 200 + JSON
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                          FRONTEND (React)                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Response Handler:                                                        │
│  ├─ Stop loading spinner                                                 │
│  ├─ Store testCases in React state                                       │
│  ├─ Render TestCaseDisplay component                                     │
│  └─ Display success message with stats                                   │
│                                                                            │
│  User can now:                                                            │
│  ├─ View test cases in grid format                                       │
│  ├─ Edit actual results & test results                                   │
│  ├─ Export to JSON/CSV/PDF                                               │
│  └─ Generate new test cases with different provider                      │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### TestCase Model
```typescript
interface TestCase {
  number: string;              // e.g., "TC-001"
  name: string;                // e.g., "Valid Login Credentials"
  scenario: string;            // e.g., "User enters correct email and password"
  description: string;         // e.g., "Verify user can login successfully"
  steps: string[];             // e.g., ["Step 1: Navigate to login", "Step 2: ..."]
  acceptance: string;          // Acceptance criteria
  expected: string;            // Expected results
  actual: string;              // Actual results (filled by tester)
  result: 'pass' | 'fail' | ''; // Test result
  type: 'functional' | 'non-functional';
  createdAt?: string;          // ISO timestamp
  tags?: string[];             // e.g., ["login", "authentication"]
}
```

### GenerateTestCasesRequest Model
```typescript
interface GenerateTestCasesRequest {
  requirement: string;                              // User requirement/input
  inputFormat: 'text' | 'document' | 'json' | 'markdown';
  llmProvider: 'ollama' | 'grow-api' | 'claude' | 'gemini';
  includeNonFunctional?: boolean;                  // Default: true
  includeEdgeCases?: boolean;                      // Default: false
  maxTestCases?: number;                           // Default: 10
}
```

### GenerateTestCasesResponse Model
```typescript
interface GenerateTestCasesResponse {
  success: boolean;
  provider: string;                    // Provider used
  timestamp: string;                   // ISO timestamp
  testCases: TestCase[];
  totalCount: number;
  functionalCount: number;
  nonFunctionalCount: number;
  generationTime: string;              // e.g., "2.5s"
  errors?: string[];                   // Any warnings/errors
}
```

### ErrorResponse Model
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;                       // e.g., "INVALID_INPUT", "LLM_UNAVAILABLE"
    message: string;
    details?: Record<string, string>;   // Field-specific errors
  };
  timestamp: string;
}
```

### LLMProvider Model
```typescript
interface LLMProvider {
  id: 'ollama' | 'grow-api' | 'claude' | 'gemini';
  name: string;                        // e.g., "Ollama (Local)"
  type: 'local' | 'cloud';
  status: 'available' | 'unavailable';
  configured: boolean;                 // Whether credentials are set
  apiEndpoint?: string;
  model?: string;                      // e.g., "mistral"
}
```

---

## State Management Flow (React)

```
App Component State:
├── requirements: string
├── inputFormat: 'text' | 'document' | ...
├── selectedProvider: 'ollama' | 'grow-api' | ...
├── isLoading: boolean
├── testCases: TestCase[]
├── error: string | null
├── totalCount: number
├── filters: {
│   searchText: string
│   typeFilter: 'all' | 'functional' | 'non-functional'
│   resultFilter: 'all' | 'pass' | 'fail' | 'not-run'
│ }
└── generationTime: string

Actions:
├── setRequirements(text)
├── setInputFormat(format)
├── selectProvider(provider)
├── generateTestCases() → API call
├── updateTestCaseResult(tcIndex, result)
├── exportTestCases(format) → JSON/CSV/PDF
├── setFilter(filterType, value)
└── clearResults()
```

---

## Error Handling Strategy

| Status Code | Error Type | Frontend Handling |
|------------|-----------|------------------|
| 400 | Bad Request | Show validation error tips |
| 422 | Unprocessable | Show field-specific errors |
| 500 | Server Error | Show "Try again" + suggest alternative provider |
| 503 | Service Unavailable | Show "LLM unavailable, trying fallback..." |
| 504 | Gateway Timeout | Show "Request timed out, try again" |

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/generate-test-cases` | Generate test cases |
| POST | `/api/parse-input` | Parse input format |
| GET | `/api/llm-providers` | List available providers |
| GET | `/api/health` | Health check (optional) |
| POST | `/api/export` | Export test cases (optional) |
