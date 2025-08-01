const cron = require('node-cron');
const fs = require('fs/promises');
const path = require('path');
const CONSTANTS = require('../constants');
const ServerError = require('../errors/ServerError');

const LOGS_DIR = path.resolve(__dirname, '..', '..', CONSTANTS.LOGS.DIR);
const ERROR_LOG_FILE = path.join(LOGS_DIR, CONSTANTS.LOGS.ERRORS_FILE_NAME);

const saveLogs = async () => {
  try {
    const logs = await fs.readFile(ERROR_LOG_FILE, { encoding: 'utf8' });

    const logsArray = logs
      .split('\n')
      .filter((log) => log !== '')
      .map((log) => {
        const { stackTrace, ...values } = JSON.parse(log);
        return JSON.stringify(values);
      });

    const newFileName = `${Date.now()}.log`;
    const newFilePath = path.join(LOGS_DIR, newFileName);

    await fs.writeFile(newFilePath, logsArray.join('\n'));
    await fs.writeFile(ERROR_LOG_FILE, '');
  } catch (error) {
    new ServerError(`Error in schedule logger, ${error}`);
  }
};

cron.schedule(
  `${CONSTANTS.LOGS.SCHEDULE_CRON}`,
  async () => {
    try {
      await saveLogs();
    } catch (error) {
      throw new ServerError(`Error in scheduled task: ${error.message}`, error);
    }
  },
  {
    scheduled: true,
    timezone: CONSTANTS.LOGS.SCHEDULE_TIMEZONE,
  }
);
