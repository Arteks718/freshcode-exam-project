const winston = require('winston');
const { combine, printf, errors } = winston.format;

const customFormat = printf(({ message, stack, code }) => {
  return JSON.stringify({
    message,
    time: new Date().getTime(),
    code,
    stackTrace: stack
  });
});

const errorLogger = winston.createLogger({
  format: combine(errors({ stack: true }), customFormat),
  transports: [
    new winston.transports.File({
      filename: 'combined.log',
    }),
  ],
});

module.exports = errorLogger;