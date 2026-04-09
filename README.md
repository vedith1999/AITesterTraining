# AI Test Case Generator

🤖 Generate comprehensive test cases using Local LLMs (Ollama, Grow API, etc.)

---

## Quick Start (1-Hour Setup)

### Prerequisites
- Node.js 16+ and npm
- Ollama running locally (recommended)
  - [Download Ollama](https://ollama.ai)
  - Run: `ollama run mistral`

### Step 1: Backend Setup

```bash
cd test-case-generator-backend
npm run dev
```

Server starts at: `http://localhost:5000`

**Expected output:**
```
🚀 Server running on http://localhost:5000
```

### Step 2: Frontend Setup (New Terminal)

```bash
cd test-case-generator
npm start
```

App starts at: `http://localhost:3000`

### Step 3: Use the Application

1. Open `http://localhost:3000` in your browser
2. Enter your requirement (plain text, JSON, or upload a file)
3. Select an LLM provider (Ollama, Grow API, etc.)
4. Click "Generate Test Cases"
5. View, edit, and export results

---

## Project Structure

```
AITesterBlueprint2X/
├── test-case-generator/           # React frontend
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── services/              # API client
│   │   ├── store/                 # State management (Zustand)
│   │   ├── styles/                # Component styles
│   │   └── App.jsx                # Main app
│   └── package.json
│
├── test-case-generator-backend/   # Node.js + TypeScript backend
│   ├── src/
│   │   ├── server.ts              # Express server
│   │   ├── routes/                # API routes
│   │   ├── controllers/           # Business logic
│   │   ├── services/              # LLM integration
│   │   └── utils/                 # Helpers
│   ├── dist/                      # Compiled JavaScript
│   └── package.json
│
└── Design/                        # Project documentation
    ├── task_plan.md               # Blueprint & phases
    ├── findings.md                # Research & constraints
    ├── system_architecture.md     # Architecture diagrams
    ├── ui_wireframe.md            # UI specifications
    └── api_flow_models.md         # API & data models
```

---

## API Endpoints

### Generate Test Cases
**POST** `/api/generate-test-cases`

```json
{
  "requirement": "User login with email and password",
  "inputFormat": "text",
  "llmProvider": "ollama",
  "includeNonFunctional": true,
  "includeEdgeCases": false
}
```

### Get Available Providers
**GET** `/api/llm-providers`

### Parse Input
**POST** `/api/parse-input`

---

## Supported Input Formats

✅ Plain Text  
✅ JSON  
✅ Markdown  
✅ Document Upload (PDF, TXT, etc.)

---

## Supported LLM Providers

### 1. Ollama (Local - Recommended)
- ✅ Free and local (privacy-friendly)
- ✅ No subscription needed
- Model: `mistral` or `neural-chat`
- Setup: `ollama run mistral`

### 2. Grow API (Cloud)
- Set `GROW_API_KEY` in backend `.env`

### 3. Claude (Optional)
- Set `CLAUDE_API_KEY` in backend `.env`

### 4. Gemini (Optional)
- Set `GEMINI_API_KEY` in backend `.env`

---

## Environment Configuration

### Backend (.env)
```env
PORT=5000
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=mistral
GROW_API_KEY=
CLAUDE_API_KEY=
GEMINI_API_KEY=
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_DEBUG=true
```

---

## Features

✨ **AI-Powered Generation**
- Generate functional & non-functional test cases
- Support for edge cases and boundary conditions

🔄 **LLM Provider Switching**
- Switch between providers without restarting
- Fallback to secondary provider on failure

📝 **Multiple Input Formats**
- Plain text requirements
- JSON specifications
- Markdown documentation
- File upload support

💾 **Test Case Management**
- View test cases in Jira format
- Edit actual results
- Mark pass/fail status
- Export to JSON/CSV

🎨 **Beautiful UI**
- Responsive design (desktop, tablet, mobile)
- Dark/light mode ready
- Intuitive workflow

---

## Testing

### Manual Test Scenario

```
Requirement: "User should be able to login with valid email and password"

Expected Output:
- 3-5 test cases generated
- Includes functional (login logic) and non-functional (performance, security) cases
- All fields populated: TC number, name, scenario, steps, acceptance criteria
- Results displayed in Jira format
```

### Test Case Format

Each generated test case includes:
- **Number**: TC-001, TC-002, etc.
- **Name**: Descriptive test name
- **Scenario**: User action being tested
- **Description**: What's being validated
- **Steps**: Action sequence (array)
- **Acceptance Criteria**: Pass conditions
- **Expected Results**: System response
- **Type**: Functional or Non-Functional

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000

# Check Ollama is running
curl http://localhost:11434/api/tags
```

### Ollama not responding
```bash
# Start Ollama (if not running)
ollama serve

# In another terminal, pull a model
ollama run mistral
```

### Frontend can't connect to backend
- Verify backend is running: `http://localhost:5000`
- Check `.env` has correct API URL
- Can also manually test: `curl http://localhost:5000/api/health`

### Test cases not generating
- Check LLM provider is available
- Verify requirement is not empty
- Check backend logs for errors
- Try Ollama provider as fallback

---

## Performance

- **Test Case Generation**: ~2-3 seconds (Ollama local)
- **API Response**: <100ms (excluding LLM call)
- **UI Load**: <1s with React lazy loading

---

## Next Steps / Future Enhancements

- 🗄️ Database persistence (optional)
- 🔐 User authentication & teams
- 📊 Test metrics dashboard
- 🔗 Jira integration (export directly)
- 🌍 Multi-language support
- 📱 Mobile app
- 🚀 Cloud deployment

---

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend logs: `npm run dev`
3. Check frontend console: Open DevTools (F12)
4. Verify both servers running on correct ports

---

## License

MIT License - Open Source

---

## Development Team

Built with ❤️ using:
- React + Zustand
- Express + TypeScript
- Ollama + LLMs
- Modern Web Stack

---

**Happy Testing! 🚀**
