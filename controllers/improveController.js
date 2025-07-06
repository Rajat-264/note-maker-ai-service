const Topic = require('../models/Topic');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", 
});

const enhanceTopic = async (req, res) => {
  try {
    const { mode = 'improve' } = req.query;
    const topic = await Topic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const fullText = topic.notes.join('\n');

    const systemPrompts = {
      improve: "Improve and organize the following content. Return only the improved version.- Add indentation and spacing where appropriate.- Do not include any explanation or extra text outside the content.",
      summarize: "Summarize and organize the following content into concise bullet points. Return only the improved version.- Use normal text for content (surround them with **).- Do not include any explanation or extra text outside the content.",
      expand: "Elaborate, expand and organize the following content to explain the concepts in detail, with clarity.Return only the improved version.- Use normal text for content(surround them with **).- Do not include any explanation or extra text outside the content.",
      formal: "Rewrite the following content in a formal tone suitable for academic or professional purposes. Return only the improved version.- Add indentation and spacing where appropriate.- Do not include any explanation or extra text outside the content.",
      flashcards: "Convert the content into question-answer style flashcards.Return only the improved version.- Add indentation and spacing where appropriate.- Do not include any explanation or extra text outside the content.",
      simplify: "Simplify the content so it's understandable by a high school student. Use simpler words and shorter sentences. Return only the improved version.- Add indentation and spacing where appropriate.- Do not include any explanation or extra text outside the content."
    };

    const prompt = systemPrompts[mode] || systemPrompts.improve;

    const response = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        { role: 'user', content: `${prompt}\n\n${fullText}` }
      ]
    });

    const improvedText = response.choices[0].message.content;
    const improvedNotes = improvedText.split('\n');

    res.json({
      message: `${mode.charAt(0).toUpperCase() + mode.slice(1)} version generated successfully`,
      originalNotes: topic.notes,
      improvedNotes,
      mode
    });

  } catch (err) {
    console.error(`AI ${req.query.mode || 'improve'} Error:`, err);
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

module.exports = { enhanceTopic, replaceNotes };
