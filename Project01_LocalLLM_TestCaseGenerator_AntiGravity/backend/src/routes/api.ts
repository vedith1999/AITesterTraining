import { Router } from 'express';
import { handleGenerate, handleTestConnection } from '../controllers/generationController';

const router = Router();

// Define API routes
router.post('/generate', handleGenerate);
router.post('/test-connection', handleTestConnection);

export default router;
