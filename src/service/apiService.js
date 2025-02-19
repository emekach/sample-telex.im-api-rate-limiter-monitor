// src/service/apiService.js
const axios = require('axios');
const logger = require('../utils/logger');

// Function to fetch the API usage from the weather API (or any API that provides rate limit details)
const fetchApiUsage = async (apiEndpoint, apiKey) => {
  try {
    const response = await axios.get(apiEndpoint, {
      params: { appid: apiKey },
    });

    // Simulate getting rate limit usage (modify based on actual API)
    const remainingUsage = response.headers['x-ratelimit-remaining'];
    const totalUsage = response.headers['x-ratelimit-limit'];

    logger.info(
      `Fetched API usage - Remaining: ${remainingUsage}, Total: ${totalUsage}`
    );

    return {
      remaining: remainingUsage,
      total: totalUsage,
    };
  } catch (error) {
    logger.error(`Error fetching API usage: ${error.message}`);
    return {
      remaining: 0,
      total: 0,
    };
  }
};

// Function to prepare and send the data to Telex
const sendToTelex = async (returnUrl, usage, rateLimit) => {
  const message = `API Usage: ${usage.remaining}/${rateLimit}. Remaining: ${usage.remaining}.`;

  const data = {
    message: message,
    event_name: 'API Rate Limit Check',
    username: 'API Rate Limiter Monitor',
    status: 'success',
  };

  try {
    const response = await axios.post(returnUrl, data);
    logger.info(`Telex response: ${response.statusText}`);
  } catch (error) {
    logger.error(`Error sending data to Telex: ${error.message}`);
  }
};

module.exports = { fetchApiUsage, sendToTelex };
