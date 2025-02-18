const { fetchApiUsage } = require('../service/apiService');
const logger = require('../utils/logger');

const processTick = async (req, res) => {
  try {
    const { channel_id, return_url, settings } = req.body;

    const apiEndpoint = settings.find(
      (s) => s.label === 'API Endpoint'
    ).default;
    const apiKey = settings.find((s) => s.label === 'API Key').default;
    const rateLimit = parseInt(
      settings.find((s) => s.label === 'Rate Limit').default,
      10
    );

    const usage = await fetchApiUsage(apiEndpoint, apiKey);
    const remaining = rateLimit - usage;

    let message = `API Usage: ${usage}/${rateLimit}. Remaining: ${remaining}.`;
    if (remaining < rateLimit * 0.1) {
      message += ' Warning: Approaching rate limit!';
    }

    await axios.post(return_url, {
      channel_id,
      text: message,
    });

    res.status(200).json({ message: 'Tick processed successfully.' });
  } catch (error) {
    logger.error('Error processing tick:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { processTick };
