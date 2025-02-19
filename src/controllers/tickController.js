const axios = require('axios');
const { fetchApiUsage } = require('../service/apiService');
const logger = require('../utils/logger');

// Main function to process each tick
const processTick = async (req, res) => {
  try {
    const { channel_id, return_url, settings } = req.body;

    // Log incoming data for debugging purposes
    logger.info('Received request body:', req.body);

    // Extract settings values using destructuring and fallback defaults
    const apiEndpoint =
      settings.find((s) => s.label === 'API Endpoint')?.default || '';
    const apiKey = settings.find((s) => s.label === 'API Key')?.default || '';
    const rateLimit =
      parseInt(settings.find((s) => s.label === 'Rate Limit')?.default, 10) ||
      1000;

    // Check for required settings
    if (!apiEndpoint || !apiKey) {
      return res.status(400).json({
        error: 'API Endpoint and API Key are required.',
      });
    }

    logger.info('API Endpoint:', apiEndpoint);
    logger.info('API Key:', apiKey);
    logger.info('Rate Limit:', rateLimit);

    // Fetch API usage from the provided endpoint
    const usage = await fetchApiUsage(apiEndpoint, apiKey);
    logger.info('Fetched API usage:', usage);

    const remaining = rateLimit - usage;
    logger.info('Remaining usage:', remaining);

    let message = `API Usage: ${usage}/${rateLimit}. Remaining: ${remaining}.`;

    // Check if we're nearing the rate limit and append a warning if so
    if (remaining < rateLimit * 0.1) {
      message += ' Warning: Approaching rate limit!';
    }

    // Prepare the payload to send to the Telex return URL
    const payload = {
      message,
      username: 'API Rate Limiter Monitor',
      event_name: 'API Rate Limit Check',
      status: remaining < rateLimit * 0.1 ? 'error' : 'success',
    };

    logger.info('Prepared payload to send to Telex:', payload);

    // Log the return_url to ensure it's correct
    logger.info('Sending to return_url:', return_url);

    // Send the message to the Telex return URL
    const response = await axios.post(return_url, payload);
    logger.info('Telex response:', response.data);

    // Respond to the incoming tick request
    res.status(200).json({ message: 'Tick processed successfully.' });
  } catch (error) {
    // Log the error for debugging purposes
    logger.error('Error processing tick:', error);

    // Respond with a generic 500 error and include the message for debugging
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    });
  }
};

// Export the function to be used in other parts of the application
module.exports = { processTick };
