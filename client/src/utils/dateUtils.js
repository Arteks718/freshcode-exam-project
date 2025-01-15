import {
  intervalToDuration,
  formatDuration,
  parseISO,
  differenceInDays,
  differenceInHours,
} from 'date-fns';

export const formatTimeRemaining = (startDate, finishDate) => {
  return formatDuration(
    intervalToDuration({ start: startDate, end: finishDate })
  )
    .replace(
      /\b(years?|months?|days?|hours?|minutes?|seconds?)\b/g,
      (match) => match[0]
    )
    .replace(/(\d)\s+([a-zA-Z])/g, '$1$2');
};

export const calculateProgress = (startDate, currentDate, finishDate) => {
  const totalDuration =
    new Date(finishDate).getTime() - new Date(startDate).getTime();
  const elapsedDuration =
    new Date(currentDate).getTime() - new Date(startDate).getTime();

  if (elapsedDuration < 0) return 0;
  if (elapsedDuration > totalDuration) return 100;

  return (elapsedDuration / totalDuration) * 100;
};

export const getTimeStr = (createdAt, long = false) => {
  const now = new Date();
  const createdDate = parseISO(createdAt);
  
  const days = differenceInDays(now, createdDate);
  const hours = differenceInHours(now, createdDate) % 24;

  const daysStr = long ? `${days} days` : `${days}d`;
  const hoursStr = long ? `${hours} hours` : `${hours}h`;

  let str = '';
  if (days !== 0) str = daysStr;
  if (hours !== 0) str += hoursStr;

  return str || 'less than one hour';
};
