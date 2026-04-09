# Findings: AI Test Case Generator

## Discovery Phase Summary

### Project Requirements (Confirmed)
- Generate test cases from user-provided requirements
- Support multiple LLM providers with seamless switching
- Accept various input formats
- Output in Jira-compatible format
- No data persistence needed
- 1-hour completion deadline

---

## Key Technical Discoveries

### LLM Stack
- **Primary:** Ollama (locally hosted)
- **Secondary:** Grow API
- **Optional Cloud:** Claude API, Gemini API
- **Requirement:** Application must support provider switching without full restart

### Input Acceptance Formats
✅ Plain text requirements  
✅ Document uploads (TXT, PDF, Markdown)  
✅ Structured JSON  
✅ Application must parse all formats uniformly  

### Output Format: Jira-Compatible Test Case
```
Test Case Number: TC-###
Test Case Name: [Name]
Test Case Scenario: [Scenario]
Test Description: [Description]
Test Steps: [Step 1, Step 2, ...]
Acceptance Criteria: [Criteria]
Expected Results: [Results]
Actual Results: [Filled by tester]
Test Case Result: [Pass/Fail]
```

### Functional vs Non-Functional Test Cases
- **Functional:** Feature-specific requirements
- **Non-Functional:** Performance, security, usability, reliability
- Both must be generated from single requirement input

---

## Constraints Identified

### Hard Constraints
- **Time:** 1 hour completion target
- **Persistence:** No database/storage requirement → display-only approach
- **Authentication:** None required
- **Deployment:** Local development (no cloud deployment needed)
- **Data Privacy:** No sensitive data handling concerns

### Architecture Constraints
- Frontend must communicate with backend via REST API
- LLM provider switching requires flexible architecture
- Input parsing must be robust for multiple formats
- Output must be exportable/displayable in UI

---

## Technical Assumptions

### Frontend
- React is suitable for rapid UI development
- File upload library (e.g., react-dropzone) needed for document handling
- Can parse uploaded documents using file APIs + text extraction

### Backend
- Ollama runs locally on developer machine OR Docker container
- Grow API requires API key (user-provided)
- Node.js + TypeScript allows rapid API development
- Prompt engineering can generate valid test cases from requirements

### LLM Capabilities
- LLMs understand test case structure from prompt engineering
- Can distinguish functional vs non-functional aspects
- Output will be reliably parseable JSON

---

## Risks & Mitigations

| Risk | Likelihood | Mitigation |
|------|-----------|-----------|
| Ollama not running | Medium | Provide setup guide, fallback to Grow API |
| Document parsing fails | Low | Use robust text extraction, validate input |
| LLM output format inconsistent | Medium | Implement strict prompt + response validation |
| 1-hour deadline missed | Low | Prioritize MVP features, skip optional APIs |
| API rate limits | Low | Cache results, user warning on rapid requests |

---

## Design Decisions

✅ **Display-only approach** (no persistence) → Simplifies architecture, meets requirements  
✅ **Flexible provider switching** → Via dropdown/config in UI  
✅ **Unified input handler** → Single parsing pipeline for all formats  
✅ **REST API** → Simpler than gRPC, easier debugging  
✅ **JSON-first response format** → Easy frontend parsing & display
