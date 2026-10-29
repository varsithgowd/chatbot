const { z } = require('zod');

const sectionSchema = z.object({
  heading: z.string().min(1, 'Section heading is required').max(200),
  content: z.string().min(1, 'Section content is required').max(5000)
});

const createArticleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  sections: z.array(sectionSchema).optional().default([]),
  category: z.string().min(2, 'Category is required').max(100),
  product: z.string().min(2, 'Product is required').max(100),
  tags: z.array(z.string().trim()).optional().default([]),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft')
});

const updateArticleSchema = createArticleSchema.partial();

module.exports = {
  createArticleSchema,
  updateArticleSchema
};

