const express = require('express');
const { enhanceTopic, replaceNotes } = require('../controllers/improveController.js');

const router = express.Router();
router.post('/enhance/:topicId', enhanceTopic);
router.put('/replace/:id', replaceNotes);
module.exports = router;
