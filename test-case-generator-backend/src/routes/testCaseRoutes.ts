import { Router } from 'express';
import {
  generateTestCases,
  parseInputEndpoint,
  getLLMProviders,
} from '../controllers/testCaseController';

const router = Router();

// POST /api/generate-test-cases
router.post('/generate-test-cases', generateTestCases);

// POST /api/parse-input
router.post('/parse-input', parseInputEndpoint);

// GET /api/llm-providers
router.get('/llm-providers', getLLMProviders);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default router;
