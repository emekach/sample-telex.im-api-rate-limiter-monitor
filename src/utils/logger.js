const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    new DailyRotateFile({
      filename: 'logs/%DATE%-result.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ],
});

module.exports = logger;
