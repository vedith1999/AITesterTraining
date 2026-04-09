"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const generationController_1 = require("../controllers/generationController");
const router = (0, express_1.Router)();
// Define API routes
router.post('/generate', generationController_1.handleGenerate);
exports.default = router;
