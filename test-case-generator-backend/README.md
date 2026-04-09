# AI Test Case Generator - Backend

Express.js + TypeScript backend for AI-powered test case generation using local LLMs.

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Ollama running locally (or Grow API key configured)

### Installation

```bash
npm install
```

### Configuration

Edit `.env` file:
```env
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
GROW_API_KEY=your_key_here (optional)
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Build & Deployment

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/generate-test-cases
Generate test cases from requirements

**Request:**
```json
{
  "requirement": "User should login with email and password",
  "inputFormat": "text",
  "llmProvider": "ollama",
  "includeNonFunctional": true,
  "includeEdgeCases": false
}
```

**Response:**
```json
{
  "success": true,
  "provider": "ollama",
  "testCases": [...],
  "totalCount": 5,
  "functionalCount": 3,
  "nonFunctionalCount": 2,
  "generationTime": "2.5s"
}
```

### GET /api/llm-providers
List available LLM providers

### POST /api/parse-input
Parse input in different formats (text, JSON, markdown)

### GET /api/health
Health check

## Architecture

- `src/server.ts` - Express server setup
- `src/routes/` - API route definitions
- `src/controllers/` - Business logic
- `src/services/` - LLM integration
- `src/utils/` - Helpers (prompt building, response parsing)

## LLM Providers

1. **Ollama** (local, recommended)
   - Free, runs locally
   - No API key needed

2. **Grow API** (optional)
   - Cloud-based API key required

3. **Claude** (optional)
   - Requires Anthropic API key

4. **Gemini** (optional)
   - Requires Google API key
