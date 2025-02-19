// src/controllers/tickcontrollers.js
const { fetchApiUsage, sendToTelex } = require('../service/apiService');
const logger = require('../utils/logger');

let previousUsage = null; // Track previous usage

const tickController = async (req, res) => {
  const { return_url, settings } = req.body;

  // Log the incoming request body for debugging
  logger.info('Received request body:');
  logger.info(`Return URL: ${return_url}`);
  logger.info(`Settings: ${JSON.stringify(settings)}`);

  const apiEndpoint = settings.find(s => s.label === 'API Endpoint').default;
  const apiKey = settings.find(s => s.label === 'API Key').default;

  // Fetch the API usage
  const usage = await fetchApiUsage(apiEndpoint, apiKey);

  // If usage has changed significantly (e.g., remaining usage is low), send a message to Telex
  if (usage.remaining !== previousUsage) {
    logger.info(`API Usage: ${usage.remaining}/${rateLimit}. Remaining: ${usage.remaining}.`);
    await sendToTelex(return_url, usage, rateLimit);
    previousUsage = usage.remaining; // Update the previous usage for next check
  }

  res.status(202).send({ status: 'accepted' });
};

module.exports = { tickController };
