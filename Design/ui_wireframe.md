# UI/UX Wireframe: AI Test Case Generator

## Main Application Layout

```
╔════════════════════════════════════════════════════════════════════════╗
║                     AI TEST CASE GENERATOR                             ║
║  Logo                                                    [Docs] [GitHub]║
╠════════════════════════════════════════════════════════════════════════╣
║                                                                          ║
║  ┌──────────────────────────────── LEFT PANEL ──────────────────────┐  ║
║  │                                                                   │  ║
║  │  INPUT SECTION                                                   │  ║
║  │  ┌────────────────────────────────────────────────────────────┐  │  ║
║  │  │ Requirement Input                      [Clear]             │  │  ║
║  │  │ ┌──────────────────────────────────────────────────────┐   │  │  ║
║  │  │ │ Paste your requirement here or upload a document... │   │  │  ║
║  │  │ │                                                       │   │  │  ║
║  │  │ │                                                       │   │  │  ║
║  │  │ └──────────────────────────────────────────────────────┘   │  │  ║
║  │  └────────────────────────────────────────────────────────────┘  │  ║
║  │                                                                   │  ║
║  │  INPUT FORMAT                                                    │  ║
║  │  ◉ Plain Text    ○ Structured JSON    ○ Markdown               │  │  ║
║  │                                                                   │  ║
║  │  FILE UPLOAD                                                     │  ║
║  │  ┌────────────────────────────────────────────────────────────┐  │  ║
║  │  │  📄 Drag & drop files here or click to browse              │  │  ║
║  │  │  (Supports: .txt, .pdf, .md, .json)                        │  │  ║
║  │  └────────────────────────────────────────────────────────────┘  │  ║
║  │                                                                   │  ║
║  │  LLM PROVIDER SELECTION                                          │  ║
║  │  Provider: [▼ Ollama (Local)]                                   │  ║
║  │            ┌─────────────────────────────┐                      │  ║
║  │            │ ✓ Ollama (Local)            │ ← Available          │  ║
║  │            │ ○ Grow API                  │ ← Configured         │  ║
║  │            │ ○ Claude API                │ ← Available          │  ║
║  │            │ ○ Gemini API                │ ← Available          │  ║
║  │            └─────────────────────────────┘                      │  ║
║  │                                                                   │  ║
║  │  OPTIONS                                                         │  ║
║  │  ☐ Include Non-Functional Test Cases                            │  ║
║  │  ☐ Include Edge Cases                                           │  ║
║  │                                                                   │  ║
║  │                                                                   │  ║
║  │  ┌─────────────────────────────────────────────────────────┐   │  ║
║  │  │         🚀 GENERATE TEST CASES                          │   │  ║
║  │  └─────────────────────────────────────────────────────────┘   │  ║
║  │                                                                   │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
║                                                                          ║
║  ┌──────────────────────────────── RIGHT PANEL ────────────────────┐  ║
║  │                                                                   │  ║
║  │  OUTPUT SECTION                                                  │  ║
║  │                                                                   │  ║
║  │  ⏳ Generating test cases... (3/5)                   [Cancel]   │  ║
║  │                                                                   │  ║
║  │  ┌─────────────────────────────────────────────────────────┐   │  ║
║  │  │ Generated Test Cases                      [📥 Export]   │   │  ║
║  │  ├─────────────────────────────────────────────────────────┤   │  ║
║  │  │ Filter: [Text..]     [Functional ▼] [Passed ▼]          │   │  ║
║  │  ├─────────────────────────────────────────────────────────┤   │  ║
║  │  │                                                           │   │  ║
║  │  │ ┌ TC-001 ─ Valid Login with Correct Credentials ─────┐  │   │  ║
║  │  │ │ Scenario: User enters correct email and password   │  │   │  ║
║  │  │ │ Type: Functional                                   │  │   │  ║
║  │  │ │ Steps:                                             │  │   │  ║
║  │  │ │  1. Navigate to login page                         │  │   │  ║
║  │  │ │  2. Enter valid email                              │  │   │  ║
║  │  │ │  3. Enter valid password                           │  │   │  ║
║  │  │ │  4. Click 'Login'                                  │  │   │  ║
║  │  │ │ Acceptance: User redirected to dashboard          │  │   │  ║
║  │  │ │ Expected: Login successful, dashboard displayed   │  │   │  ║
║  │  │ │ Actual: ___________________                        │  │   │  ║
║  │  │ │ Result: ○ Pass  ○ Fail  ○ Not Run                 │  │   │  ║
║  │  │ │                                [✏️ Edit] [❌ Delete]   │   │  ║
║  │  │ └────────────────────────────────────────────────────┘  │   │  ║
║  │  │                                                           │   │  ║
║  │  │ ┌ TC-002 ─ Login Performance (< 2s) ──────────────────┐  │   │  ║
║  │  │ │ Scenario: System responds within acceptable time    │  │   │  ║
║  │  │ │ Type: Non-Functional (Performance)                  │  │   │  ║
║  │  │ │ [... more details ...]                              │  │   │  ║
║  │  │ └────────────────────────────────────────────────────┘  │   │  ║
║  │  │                                                           │   │  ║
║  │  │  [Load More...]                                          │   │  ║
║  │  └─────────────────────────────────────────────────────────┘   │  ║
║  │                                                                   │  ║
║  └───────────────────────────────────────────────────────────────────┘  ║
║                                                                          ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## Component Details

### 1. Input Section (Left Top)
- **Requirement Textarea**
  - Placeholder: "Paste your requirement here or upload a document..."
  - Auto-resize on input
  - Line numbers optional
  - Syntax highlighting for JSON/Markdown if detected

- **Input Format Radio Buttons**
  - Plain Text (default)
  - Structured JSON
  - Markdown

- **File Uploader**
  - Drag & drop zone
  - Click to browse
  - Support: .txt, .pdf, .md, .json

- **LLM Provider Selector**
  - Dropdown menu
  - Shows provider status (Available/Unavailable)
  - Icon indicators (cloud vs local)
  - Fallback indication

- **Options Checkboxes**
  - Include Non-Functional Test Cases
  - Include Edge Cases
  - Include Performance Metrics (optional)

- **Generate Button**
  - Large, prominent CTA
  - Disabled while loading
  - Shows spinner during generation

---

### 2. Output Section (Right)
- **Header with Export**
  - Title: "Generated Test Cases"
  - Export button (JSON, CSV, PDF)
  - Refresh button

- **Filter Controls**
  - Search/filter by text
  - Filter by type (Functional/Non-Functional)
  - Filter by status (Passed/Failed/Not Run)

- **Test Case Cards**
  - Expandable/collapsible
  - Shows:
    - TC Number & Name (header)
    - Scenario
    - Type badge (Functional/Non-Functional)
    - Steps (numbered list)
    - Acceptance Criteria
    - Expected Results
    - Actual Results (editable field)
    - Result radio buttons (Pass/Fail/Not Run)
  - Edit/Delete buttons
  - Duplicate button (optional)

- **Loading State**
  - Progress bar showing generation progress
  - "Generating test cases..." message
  - Cancel button

- **Empty State**
  - "No test cases generated yet"
  - Instructions to start

---

## User Flows

### Flow 1: Text-Based Input
```
1. User types requirement in textarea
2. Selects "Plain Text" format
3. Chooses LLM provider
4. Clicks "Generate Test Cases"
5. System displays loading progress
6. Test cases appear in right panel
7. User can view, edit, or export
```

### Flow 2: Document Upload
```
1. User clicks file upload area or drags file
2. System detects format (PDF/TXT/JSON/Markdown)
3. File preview shown (optional)
4. User confirms and selects LLM provider
5. Clicks "Generate Test Cases"
6. Similar to Flow 1
```

### Flow 3: LLM Provider Switching
```
1. Initial generation with Ollama (local)
2. User switches provider via dropdown
3. "Provider changed" confirmation
4. Click "Generate Test Cases" again
5. New results from different provider
```

---

## Responsive Design Notes
- **Desktop (1200px+):** 2-column layout (shown above)
- **Tablet (768px-1199px):** Stacked sections, full-width
- **Mobile (< 768px):** Single column, input then output

---

## Accessibility Features
- ARIA labels on all form controls
- Keyboard navigation (Tab, Enter, Space)
- Color-blind friendly badges (icons + text)
- Screen reader support for test case cards
- Focus indicators on interactive elements

---

## Color Scheme
- **Primary Button:** #4CAF50 (Generate)
- **Export Button:** #2196F3 (Blue)
- **Success:** #4CAF50 (Green)
- **Error:** #f44336 (Red)
- **Warning:** #ff9800 (Orange)
- **Functional Badge:** #4CAF50
- **Non-Functional Badge:** #FF9800
- **Passed Result:** #4CAF50
- **Failed Result:** #f44336
- **Not Run Result:** #9E9E9E
