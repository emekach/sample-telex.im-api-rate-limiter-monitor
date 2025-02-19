const axios = require('axios');

const fetchApiUsage = async (endpoint, apiKey) => {
  try {
    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const usage = parseInt(response.headers['x-rate-limit-usage'], 10);

    if (isNaN(usage)) {
      throw new Error('Invalid or missing "x-rate-limit-usage" header.');
    }

    return usage;
  } catch (error) {
    // Handle axios-specific errors (e.g., network issues, API down, etc.)
    console.error('Error fetching API usage:', error.message);
    throw new Error('Failed to fetch API usage. Please check the API endpoint and API key.');
  }
};

module.exports = { fetchApiUsage };
