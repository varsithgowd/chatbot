const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  matchedArticleIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article'
  }],
  answered: {
    type: Boolean,
    default: false,
    index: true
  },
  answerStatus: {
    type: String,
    enum: ['answered', 'fallback', 'unanswered'],
    default: 'unanswered',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);

