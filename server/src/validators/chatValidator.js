const { z } = require('zod');

const chatQuerySchema = z.object({
  question: z.string().trim().min(3, 'Question must be at least 3 characters').max(500, 'Question too long'),
  category: z.string().trim().max(100).optional(),
  product: z.string().trim().max(100).optional()
});

module.exports = {
  chatQuerySchema
};

