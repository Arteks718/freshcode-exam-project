import React, { useState, useEffect } from 'react';
import {
  differenceInBusinessDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInYears,
  intervalToDuration,
  roundToNearestMinutes,
  formatDuration,
} from 'date-fns';
import styles from './EventItem.module.sass';

const EventItem = (props) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const test = [{ name: 'h' }];

  useEffect(() => {
    setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);
  }, [currentTime]);
  const formatTime = (date) => {
    return formatDuration({
      years: differenceInYears(date, currentTime),
      months: differenceInMonths(date, currentTime),
      days: differenceInBusinessDays(date, currentTime),
      hours: differenceInHours(date, currentTime) % 24,
      minutes: differenceInMinutes(date, currentTime) % 60,
      seconds: differenceInSeconds(date, currentTime) % 60,
    })
      .replace(
        /\b(years?|months?|days?|hours?|minutes?|seconds?)\b/g,
        (match) => match[0]
      )
      .replace(/(\d)\s+([a-zA-Z])/g, '$1$2');
  };

  const { name, finishDate, reminderDate, startDate } = props.event;
  return (
    <div className={styles.item}>
      <h3>{name}</h3>
      <p className={styles.time}>{formatTime(finishDate)}</p>
    </div>
  );
};

export default EventItem;
