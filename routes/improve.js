const express = require('express');
const { improveTopic, replaceNotes } = require('../controllers/improveController.js');

const router = express.Router();
router.post('/:topicId', improveTopic);
router.post('/topics/:id/notes/replace', replaceNotes);
module.exports = router;
