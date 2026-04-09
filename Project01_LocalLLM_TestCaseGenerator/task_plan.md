# Task Plan: AI Test Case Generator

## Project Overview
**Project Title:** AI Test Case Generator  
**Purpose:** Generate test cases from user requirements using local LLMs (Ollama primary, Grow API secondary)  
**Timeline:** 1 hour  
**Status:** Blueprint Approved ✅

---

## Phase 1: Frontend Setup (React UI)
**Goal:** Build interactive input & output interface

### Checklist:
- [ ] Create React project structure
- [ ] Build requirement input form (text, file upload, JSON/Markdown support)
- [ ] Create test case display component (Jira-compatible format)
- [ ] Add LLM provider selector (Ollama, Grow API)
- [ ] Integrate API communication layer
- [ ] Add loading states & error handling
- [ ] Style UI for usability

**Deliverable:** Functional React app accepting user requirements

---

## Phase 2: Backend Setup (Node.js + TypeScript)
**Goal:** Build API layer with LLM integration

### Checklist:
- [ ] Initialize Node.js + TypeScript project
- [ ] Create API endpoints:
  - `POST /generate-test-cases` → Main endpoint
  - `POST /parse-input` → Parse requirements
  - `GET /llm-providers` → List available providers
- [ ] Integrate Ollama API
- [ ] Integrate Grow API
- [ ] Add Claude/Gemini API support (optional)
- [ ] Implement prompt engineering for test case generation
- [ ] Add request validation & error handling

**Deliverable:** Working backend API generating Jira-formatted test cases

---

## Phase 3: Integration & Testing
**Goal:** Connect frontend to backend, validate outputs

### Checklist:
- [ ] Connect React frontend to Node.js API
- [ ] Test end-to-end flow (input → LLM → output)
- [ ] Validate test case output format (Jira structure)
- [ ] Test with sample requirements
- [ ] Verify LLM provider switching works
- [ ] Manual testing of edge cases

**Deliverable:** Complete working application ready for use

---

## Output Format Specification
Test cases must include:
- Test Case Number
- Test Case Name
- Test Case Scenario
- Test Description
- Test Steps
- Acceptance Criteria
- Expected Results
- Actual Results
- Test Case Result

---

## Technical Stack
- **Frontend:** React
- **Backend:** Node.js + TypeScript
- **LLM Primary:** Ollama (local)
- **LLM Secondary:** Grow API
- **Optional:** Claude API, Gemini API
- **Input Types:** Plain text, Documents (PDF/TXT), JSON, Markdown
- **No Persistence:** Display only in UI
- **No Authentication:** Open access

---

## Success Criteria
✅ User can input requirements in multiple formats  
✅ System generates test cases using selected LLM provider  
✅ Output displays in Jira-compatible format  
✅ User can switch between LLM providers  
✅ Application completes in ~1 hour
