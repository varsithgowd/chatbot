const { processChatMessage } = require('../services/chatService');

async function handleChat(req, res, next) {
  try {
    const { question, category, product } = req.body;

    const result = await processChatMessage({
      question,
      category,
      product
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  handleChat
};

