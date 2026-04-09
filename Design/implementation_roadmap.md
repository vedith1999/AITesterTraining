# Implementation Roadmap: AI Test Case Generator

## Overview
This document outlines the step-by-step implementation plan for the AI Test Case Generator project, following Protocol 0 documentation and design specifications.

---

## Phase 1: Frontend Development (React) — ~20 minutes

### Step 1.1: Project Initialization
```bash
npx create-react-app test-case-generator
cd test-case-generator
npm install axios react-dropzone zustand
```

**Installation targets:**
- `axios` - HTTP client for API calls
- `react-dropzone` - File upload component
- `zustand` - Lightweight state management

**Deliverable:** Runnable React app on `localhost:3000`

---

### Step 1.2: Build Core Components
**Files to create:**
- `src/components/InputSection.jsx` - Requirement input + file upload
- `src/components/ProviderSelector.jsx` - LLM provider dropdown
- `src/components/TestCaseDisplay.jsx` - Output grid/cards
- `src/components/LoadingIndicator.jsx` - Progress spinner
- `src/App.jsx` - Main app layout

**Key features per component:**
- InputSection: Textarea, file uploader, format radio buttons, options checkboxes
- ProviderSelector: Dropdown showing available providers with status
- TestCaseDisplay: Expandable test case cards with Jira format
- LoadingIndicator: Progress bar with percentage
- App: 2-column layout, handle state + API calls

**Deliverable:** UI matching wireframe, functional state management

---

### Step 1.3: Setup API Integration
- Create `src/services/api.js` - Axios instance to `localhost:5000/api`
- Create `src/hooks/useTestCaseGenerator.js` - Custom hook for API calls
- Implement error handling & loading states

**Deliverable:** Working API client layer

---

### Step 1.4: Style & Polish
- Add CSS/styled-components for responsiveness
- Ensure mobile-friendly layout (tablet/mobile stacks vertically)
- Add color scheme from design spec

**Deliverable:** Polished, responsive UI

---

## Phase 2: Backend Development (Node.js + TypeScript) — ~15 minutes

### Step 2.1: Project Setup
```bash
mkdir test-case-generator-backend
cd test-case-generator-backend
npm init -y
npm install express ts-node typescript @types/express @types/node axios dotenv
npm install --save-dev nodemon
```

**Setup TypeScript:**
```bash
npx tsc --init
# Configure: target: ES2020, module: commonjs, strict: true
```

**Deliverable:** TypeScript-enabled Node.js project

---

### Step 2.2: Create Express API Structure
**Files to create:**
- `src/server.ts` - Express app setup, port 5000
- `src/routes/testCases.ts` - API route definitions
- `src/controllers/testCaseController.ts` - Main logic
- `src/services/llmService.ts` - LLM interface
- `src/services/ollamaService.ts` - Ollama integration
- `src/services/growApiService.ts` - Grow API integration
- `src/services/inputParserService.ts` - Parse requirements
- `src/utils/promptBuilder.ts` - Prompt engineering
- `src/utils/responseParser.ts` - Parse LLM output

**Deliverable:** Structured, maintainable backend codebase

---

### Step 2.3: Implement LLM Integration

#### Ollama Service
```typescript
// POST http://localhost:11434/api/generate
// Model: "mistral" or "neural-chat"
// No authentication
// Timeout: 30s
```

#### Grow API Service
```typescript
// POST https://api.grow.com/v1/generate
// Auth: Bearer token from env
// Timeout: 30s
```

**Deliverable:** Both LLM providers callable and tested

---

### Step 2.4: Implement Prompt Engineering
Create system prompt that ensures:
- Output is valid JSON
- Includes all TestCase fields
- Generates both Functional AND Non-Functional cases
- Follows naming convention (TC-001, TC-002, etc.)

**Deliverable:** Prompts producing consistent, parseable JSON

---

### Step 2.5: Create API Endpoints

#### `POST /api/generate-test-cases`
```typescript
Request validation → Parse input → Call LLM → Parse response → Return 200 + TestCases
```

#### `POST /api/parse-input`
- Handle text, document, JSON, Markdown
- Return cleaned requirement

#### `GET /api/llm-providers`
- Check provider availability
- Return status for each provider

**Deliverable:** All endpoints working, tested with curl/Postman

---

### Step 2.6: Error Handling & Validation
- Validate request payloads
- Handle LLM timeouts with fallback providers
- Return meaningful error messages
- Log errors for debugging

**Deliverable:** Robust error handling, no crashes on bad input

---

## Phase 3: Integration & Testing — ~10 minutes

### Step 3.1: Connect Frontend to Backend
- Update API_URL in React env config
- Test API calls from React app
- Verify request/response flow

**Deliverable:** Frontend successfully calling backend

---

### Step 3.2: End-to-End Testing
**Test scenarios:**
1. Plain text requirement → Generate test cases ✓
2. File upload (PDF/TXT) → Generate test cases ✓
3. JSON format → Generate test cases ✓
4. Markdown format → Generate test cases ✓
5. Switch LLM provider → Different results ✓
6. Include/exclude non-functional → Different counts ✓
7. Invalid input → Error message ✓
8. LLM timeout → Fallback provider ✓

**Deliverable:** All scenarios passing

---

### Step 3.3: Output Validation
- Verify test cases include all required fields
- Check Jira format compliance
- Validate test case numbers aren't duplicated
- Ensure functional/non-functional classification

**Deliverable:** Reliable test case generation

---

### Step 3.4: User Acceptance Testing
- Generate test cases for real-world requirements
- Verify output quality
- Test UI usability

**Deliverable:** Project ready for handoff

---

## Implementation Checklist

### Phase 1: Frontend
- [ ] React app created
- [ ] Input section components built
- [ ] Provider selector working
- [ ] Test case display component complete
- [ ] API client setup
- [ ] Styling & responsiveness done
- [ ] Loading states implemented

### Phase 2: Backend
- [ ] Node.js + TypeScript project setup
- [ ] Express server running on port 5000
- [ ] Ollama service integrated
- [ ] Grow API service integrated
- [ ] Prompt engineering complete
- [ ] All endpoints implemented
- [ ] Error handling robust
- [ ] Environment variables configured

### Phase 3: Integration
- [ ] Frontend ↔ Backend communication working
- [ ] End-to-end testing complete
- [ ] Output validation passed
- [ ] UI/UX polish complete
- [ ] Documentation updated
- [ ] Ready for production

---

## Success Criteria
✅ User inputs requirement via text or file  
✅ System generates test cases using selected LLM  
✅ Output displays in Jira-compatible format  
✅ User can switch providers and regenerate  
✅ Application completes in ~1 hour  
✅ No crashes or unhandled errors  
✅ Responsive on desktop/tablet/mobile  

---

## Quick Start Commands

### Backend
```bash
cd test-case-generator-backend
npm run dev
# Runs on http://localhost:5000
```

### Frontend
```bash
cd test-case-generator
npm start
# Runs on http://localhost:3000
```

---

## Environment Variables (.env)

### Backend (.env in root)
```
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
GROW_API_KEY=your_api_key_here
CLAUDE_API_KEY=optional
GEMINI_API_KEY=optional
NODE_ENV=development
```

### Frontend (.env in react app root)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEBUG=true
```

---

## Deployment Notes (Post-MVP)
- Frontend: Deploy to Vercel/Netlify
- Backend: Deploy to Heroku/Railway
- Database: Not needed (display-only)
- Auth: Not needed (open access)
- CI/CD: GitHub Actions (automated tests)
