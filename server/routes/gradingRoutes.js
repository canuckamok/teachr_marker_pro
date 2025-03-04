const express = require('express');
const router = express.Router();
const gradingController = require('../controllers/gradingController');

// Grading route
router.post('/analyze', gradingController.getAIGrading);

module.exports = router;