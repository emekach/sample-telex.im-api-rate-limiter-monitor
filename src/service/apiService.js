const axios = require('axios');

const fetchApiUsage = async (endpoint, apiKey) => {
  const response = await axios.get(endpoint, {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

  const usage = parseInt(response.headers['x-rate-limit-usage'], 10);
  return usage;
};

module.exports = { fetchApiUsage };
