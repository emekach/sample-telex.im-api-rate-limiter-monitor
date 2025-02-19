const axios = require('axios');

const fetchApiUsage = async (endpoint) => {
  try {
    // Fetch weather data from OpenWeather API
    const response = await axios.get(endpoint);

    // If rate limit exceeded, OpenWeather will return a 429 status
    if (response.status === 429) {
      const resetTime = response.headers['x-ratelimit-reset']; // Reset time in Unix timestamp
      throw new Error(
        `Rate limit exceeded. Try again after ${new Date(
          resetTime * 1000
        ).toISOString()}`
      );
    }

    // Assuming successful API response; we set usage to 1 as a placeholder (no actual usage data)
    return 1; // This can be adjusted based on how you want to track usage
  } catch (error) {
    console.error('Error fetching API usage:', error.message);
    throw new Error('Failed to fetch API usage');
  }
};

module.exports = { fetchApiUsage };
