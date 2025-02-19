const axios = require('axios');
const { fetchApiUsage } = require('../service/apiService');
const logger = require('../utils/logger');

const processTick = async (req, res) => {
  try {
    const { channel_id, return_url, settings } = req.body;

    // Extract settings with destructuring and fallback defaults
    const apiEndpoint =
      settings.find((s) => s.label === 'API Endpoint')?.default || '';
    const apiKey = settings.find((s) => s.label === 'API Key')?.default || '';
    const rateLimit =
      parseInt(settings.find((s) => s.label === 'Rate Limit')?.default, 10) ||
      1000;

    // Validate that both API Endpoint and API Key are provided
    if (!apiEndpoint || !apiKey) {
      return res
        .status(400)
        .json({ error: 'API Endpoint and API Key are required.' });
    }

    // Fetch API usage
    const usage = await fetchApiUsage(apiEndpoint);
    const remaining = rateLimit - usage;

    let message = `API Usage: ${usage}/${rateLimit}. Remaining: ${remaining}.`;

    // Check if remaining usage is low
    if (remaining < rateLimit * 0.1) {
      message += ' Warning: Approaching rate limit!';
    } else if (usage === 0) {
      message += ' Error: API call failed or no usage data available.';
    }

    // Send alert message to the return_url
    await axios.post(return_url, {
      channel_id,
      text: message,
    });

    res.status(200).json({ message: 'Tick processed successfully.' });
  } catch (error) {
    logger.error('Error processing tick:', error);
    res
      .status(500)
      .json({ error: 'Internal Server Error', message: error.message });
  }
};

module.exports = { processTick };
