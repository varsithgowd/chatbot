const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
    index: true
  },
  rating: {
    type: String,
    enum: ['helpful', 'not_helpful'],
    required: true,
    index: true
  },
  comment: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);

