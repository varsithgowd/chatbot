const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  heading: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, { _id: false });

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  sections: {
    type: [sectionSchema],
    default: []
  },
  category: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  product: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  tags: {
    type: [String],
    default: [],
    index: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Compound indexes for fast filtering and search
articleSchema.index({ status: 1, category: 1, product: 1 });
articleSchema.index({ status: 1, title: 'text', content: 'text', 'sections.heading': 'text', 'sections.content': 'text', tags: 'text' });

module.exports = mongoose.model('Article', articleSchema);

