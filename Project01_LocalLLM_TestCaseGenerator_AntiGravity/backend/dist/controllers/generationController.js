"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGenerate = void 0;
const llmService_1 = require("../services/llmService");
const handleGenerate = async (req, res) => {
    try {
        const { provider, model, endpoint, apiKey, requirements } = req.body;
        if (!provider || !requirements) {
            return res.status(400).json({ error: 'Provider and requirements are required' });
        }
        const rawResponse = await (0, llmService_1.generateTestCases)({
            provider,
            model,
            endpoint,
            apiKey,
            requirements
        });
        // Attempt to parse the JSON response
        let testCases = [];
        try {
            // Find the first array-like structure if the LLM wrapped it in markdown
            const match = rawResponse.match(/\[[\s\S]*\]/);
            const jsonStr = match ? match[0] : rawResponse;
            testCases = JSON.parse(jsonStr);
        }
        catch (parseError) {
            console.error('Failed to parse LLM response as JSON', rawResponse);
            return res.status(500).json({
                error: 'LLM generated invalid JSON format',
                rawResponse
            });
        }
        res.json({ testCases });
    }
    catch (error) {
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
};
exports.handleGenerate = handleGenerate;
