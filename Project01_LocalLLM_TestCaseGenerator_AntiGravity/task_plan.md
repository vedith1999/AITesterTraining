# Task Plan

## Phases
- [x] Phase 1: Discovery and Blueprint Approval
- [ ] Phase 2: Implementation
- [ ] Phase 3: Testing and Validation
- [ ] Phase 4: Final Delivery

## Goals
- Build a full-stack Web Application Test Case Generator.
- Support both Web Application and API test cases (Functional and Non-Functional).
- Integrate with multiple LLM providers (Ollama, LM Studio, Grok, OpenAI, Claude, Gemini).
- Output test cases in a structured Jira format.

## Blueprint (Pending Approval)

### 1. Architecture
- **Frontend:** React (TypeScript), designed beautifully to match `Design.png`.
- **Backend:** Node.js (TypeScript).
- **Communication:** RESTful APIs or WebSockets between frontend and backend.

### 2. Core Features
- **Input Methods:**
    - Chat interface (typing/pasting requirements).
    - File upload (documents containing requirements).
    - Jira integration (fetching requirements via Jira representation/API).
- **LLM Integration (Settings Window):**
    - Support for: Ollama API, LM Studio API, Grok API, OpenAI API, Claude API, Gemini API.
    - Ability to switch models and configure API keys/endpoints.
- **Generation Engine:**
    - Prompts engineered to produce: Functional and Non-Functional test cases (Web + API).
- **Output Formatting:**
    - Formats: Plain text descriptions, structured JSON.
    - Required Fields: Test case number, ID, scenario, steps, expected results, actual result, test case result (pass/fail).
    - Export Format: Jira compatible format.

### 3. Tech Stack
- Frontend: React, TypeScript, Vite (or Create React App), CSS Framework (Tailwind or similar, based on design).
- Backend: Node.js, Express, TypeScript.
- Other: Axios (for API calls to LLMs), Multer (for file uploads if needed).

## Checklists
- [x] Answer discovery questions
- [x] Review and Approve Blueprint
- [x] Set up Project Structure
- [x] Implement Backend (LLM Integrations)
- [x] Implement Frontend (UI matching Design.png)
- [x] Connect Frontend and Backend
- [ ] Test and Refine Prompts
