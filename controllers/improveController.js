const Topic = require('../models/Topic');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", 
});

const improveTopic = async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const originalNotes = topic.notes;
    const fullText = originalNotes.join('\n');

    const response = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{
        role: 'user',
        content: `Improve and organize this, and don't add any model generated description and don't add any comments, also highlight the headings:\n${fullText}`
      }],
    });

    const improvedText = response.choices[0].message.content;
    const improvedNotes = improvedText.split('\n');

    // Instead of saving now, return both versions
    res.json({
      message: 'Improved version generated successfully',
      originalNotes,
      improvedNotes
    });

  } catch (err) {
    console.error('AI Improvement Error:', err);
    res.status(500).json({ message: 'AI enhancement failed' });
  }
};

const replaceNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const topic = await Topic.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    topic.notes = notes;
    await topic.save();

    res.json({ message: 'Notes replaced successfully' });
  } catch (err) {
    console.error('Note Replace Error:', err);
    res.status(500).json({ message: 'Failed to replace notes' });
  }
};

module.exports = { improveTopic, replaceNotes };
