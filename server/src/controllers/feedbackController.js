const Feedback = require('../models/Feedback');
const Question = require('../models/Question');

async function submitFeedback(req, res, next) {
  try {
    const { questionId, rating, comment } = req.body;

    // Verify question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Associated question record not found'
      });
    }

    // Check for existing feedback on this question
    let feedback = await Feedback.findOne({ questionId });
    if (feedback) {
      feedback.rating = rating;
      if (comment !== undefined) {
        feedback.comment = comment.trim();
      }
      await feedback.save();
    } else {
      feedback = await Feedback.create({
        questionId,
        rating,
        comment: (comment || '').trim()
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback._id,
        questionId: feedback.questionId,
        rating: feedback.rating,
        comment: feedback.comment,
        createdAt: feedback.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitFeedback
};

