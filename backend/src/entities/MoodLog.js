const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mood: { type: String, enum: ['TIRED', 'ENERGIZED', 'STRESSED', 'NEUTRAL', 'FOCUSED'], required: true },
  notes: { type: String },
  loggedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
