const winston = require('winston');
const { combine, printf, errors } = winston.format;
const CONSTANTS = require('../constants.js')

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
      filename: `${CONSTANTS.LOGS.DIR}/${CONSTANTS.LOGS.ERRORS_FILE_NAME}`,
    }),
  ],
});

module.exports = errorLogger;
