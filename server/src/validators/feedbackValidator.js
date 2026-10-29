const { z } = require('zod');

const feedbackSchema = z.object({
  questionId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid question ID format'),
  rating: z.enum(['helpful', 'not_helpful']),
  comment: z.string().trim().max(500, 'Comment too long').optional().default('')
});

module.exports = {
  feedbackSchema
};

