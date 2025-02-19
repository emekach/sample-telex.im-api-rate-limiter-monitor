const { createLogger, format, transports } = require('winston');
const winston = require('winston');
const path = require('path');

// Define log file path
const logFilePath = path.join(__dirname, '..', 'logs', 'app.log');

// Set up logger
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    // Console transport
    new transports.Console(),

    // File transport with log rotation (daily)
    new winston.transports.DailyRotateFile({
      filename: logFilePath,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m', // max size before rotation (e.g., 20MB)
      maxFiles: '14d', // keep logs for the last 14 days
    }),
  ],
});

module.exports = logger;
