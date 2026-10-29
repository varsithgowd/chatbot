const express = require('express');
const router = express.Router();
const { submitFeedback } = require('../controllers/feedbackController');
const { validateBody } = require('../middleware/validate');
const { feedbackSchema } = require('../validators/feedbackValidator');

router.post('/feedback', validateBody(feedbackSchema), submitFeedback);

module.exports = router;

