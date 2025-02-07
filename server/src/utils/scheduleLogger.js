const {
  differenceInMilliseconds,
  add,
} = require('date-fns');
const fs = require('fs/promises');
const path = require('path');
const CONSTANTS = require('../constants');
const ServerError = require('../errors/ServerError');

const LOGS_DIR = path.resolve(__dirname, '..', CONSTANTS.LOGS.DIR);
const ERROR_LOG_FILE = path.join(LOGS_DIR, CONSTANTS.LOGS.ERRORS_FILE_NAME);

const calculateTimeUntilNextTarget = (time) => {
  const now = new Date();
  let targetTime = new Date(now);
  targetTime.setHours(time.hour, time.minute, 0, 0);
  if (targetTime <= now) {
    targetTime = add(targetTime, { days: 1 });
  }

  return differenceInMilliseconds(targetTime, now);
};

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
    new ServerError('Error in schedule logger')
  }
};

(() => {
  const timeUntilNextTarget = calculateTimeUntilNextTarget(CONSTANTS.LOGS.SCHEDULE_TIME);

  setTimeout(async () => {
    await saveLogs();
    scheduleLogSaving();
  }, timeUntilNextTarget);
})()