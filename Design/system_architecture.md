# System Architecture: AI Test Case Generator

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          USER BROWSER                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (React SPA)                       │  │
│  │                                                               │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │  │
│  │  │Input Component    │ Provider Selector  │Output Display  │   │  │
│  │  │- Text Input   │  │- Ollama            │- Test Cases    │   │  │
│  │  │- File Upload  │  │- Grow API          │- Jira Format   │   │  │
│  │  │- JSON/Markdown   │- Claude (optional) │- Export Btn    │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │  │
│  │         ↓                ↓                      ↑              │  │
│  │  ┌──────────────────────────────────────────────┐            │  │
│  │  │   API Client (Axios/Fetch)                   │            │  │
│  │  │   Base URL: localhost:5000/api               │            │  │
│  │  └──────────────────────────────────────────────┘            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              ↕ HTTP/REST                           │
└─────────────────────────────────────────────────────────────────────┘
                                    ‖
                    ════════════════════════════
                                    ‖
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  EXPRESS API (Port 5000)                                            │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Routes:                                                     │    │
│  │ • POST /api/generate-test-cases                            │    │
│  │ • POST /api/parse-input                                    │    │
│  │ • GET /api/llm-providers                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│         ↕                          ↕                  ↕             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐      │
│  │ Ollama Client│  │ Grow API     │  │ Claude/Gemini Client│      │
│  │              │  │  Client      │  │  (Optional)         │      │
│  │ localhost    │  │              │  │                     │      │
│  │ :11434       │  │ API Key Auth │  │ API Key Auth        │      │
│  └──────────────┘  └──────────────┘  └─────────────────────┘      │
│         ↓                  ↓                   ↓                    │
└─────────────────────────────────────────────────────────────────────┘
         ↓                  ↓                   ↓
    ┌─────────┐      ┌──────────┐      ┌──────────────┐
    │  OLLAMA │      │ Grow API │      │ Claude/Gemini│
    │ (Local) │      │ (Cloud)  │      │   (Cloud)    │
    └─────────┘      └──────────┘      └──────────────┘
```

---

## Component Breakdown

### Frontend Components
```
App
├── InputSection
│   ├── RequirementInput (textarea)
│   ├── FileUploader
│   └── SubmitButton
├── ProviderSelector
│   └── DropDown (Ollama, Grow API, Claude, Gemini)
├── LoadingIndicator
└── TestCaseDisplay
    ├── TestCaseTable
    ├── FilterControls
    └── ExportButton
```

### Backend Modules
```
Backend (Express + TypeScript)
├── routes/
│   └── testCaseRoutes.ts
├── controllers/
│   └── testCaseController.ts
├── services/
│   ├── llmService.ts (interface)
│   ├── ollamaService.ts
│   ├── growApiService.ts
│   └── inputParserService.ts
├── models/
│   ├── TestCase.ts
│   └── InputRequest.ts
├── utils/
│   ├── promptBuilder.ts
│   └── responseParser.ts
└── middleware/
    ├── errorHandler.ts
    └── validators.ts
```

---

## Data Flow

### Test Case Generation Flow
```
1. User provides requirement → Frontend
2. Frontend sends POST /api/generate-test-cases
   {
     requirement: string,
     inputFormat: 'text' | 'document' | 'json',
     llmProvider: 'ollama' | 'grow-api' | 'claude'
   }
3. Backend parses input
4. Backend calls selected LLM with engineered prompt
5. LLM returns test case structure (JSON)
6. Backend validates & formats response
7. Frontend receives:
   {
     testCases: [
       {
         number: 'TC-001',
         name: string,
         scenario: string,
         description: string,
         steps: string[],
         acceptance: string,
         expected: string,
         actual: '',
         result: ''
       }
     ]
   }
8. Frontend displays in grid/table format
```

---

## API Endpoints

### POST /api/generate-test-cases
**Request:**
```json
{
  "requirement": "User should be able to login with email and password",
  "inputFormat": "text",
  "llmProvider": "ollama",
  "includeNonFunctional": true
}
```

**Response:**
```json
{
  "success": true,
  "testCases": [
    {
      "number": "TC-001",
      "name": "Valid Login Credentials",
      "scenario": "User enters correct email and password",
      "description": "Verify user can login successfully",
      "steps": [
        "Navigate to login page",
        "Enter valid email",
        "Enter valid password",
        "Click Login"
      ],
      "acceptance": "User should be redirected to dashboard",
      "expected": "Login successful, dashboard displayed",
      "actual": "",
      "result": ""
    }
  ]
}
```

### POST /api/parse-input
**Request:**
```json
{
  "input": "...",
  "format": "text|document|json"
}
```

**Response:**
```json
{
  "parsed": "Cleaned requirement text",
  "format": "text"
}
```

### GET /api/llm-providers
**Response:**
```json
{
  "providers": [
    {
      "id": "ollama",
      "name": "Ollama (Local)",
      "status": "available|unavailable"
    },
    {
      "id": "grow-api",
      "name": "Grow API",
      "status": "available|unavailable"
    }
  ]
}
```

---

## LLM Integration Points

### Ollama
- **Endpoint:** `http://localhost:11434/api/generate`
- **Model:** `mistral` or `neural-chat` (configurable)
- **No auth required** (local)

### Grow API
- **Endpoint:** `https://api.grow.com/v1/generate`
- **Auth:** Bearer token in headers
- **Rate limits:** 100 req/min

### Claude/Gemini (Optional)
- **Auth:** API keys from environment
- **Rate limits:** Cloud provider specific

---

## Error Handling Flow
```
Request → Validation
    ↓
    ├─ Invalid input → Return 400 + error message
    ├─ LLM unavailable → Try fallback provider
    ├─ LLM timeout → Return 504 + cached result
    ├─ Parse error → Return 422 + partial output
    └─ Success → Return 200 + test cases
```
