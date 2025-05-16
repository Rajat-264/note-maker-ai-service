const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
  title: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: [String],
}, { timestamps: true });

module.exports = mongoose.model('Topic', topicSchema);
