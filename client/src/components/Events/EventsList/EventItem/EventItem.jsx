import React, { useState, useEffect } from 'react';
import { intervalToDuration, formatDuration, isAfter } from 'date-fns';
import styles from './EventItem.module.sass';

const EventItem = (props) => {
  const { name, finishDate, reminderDate, startDate } = props.event;
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setCurrentDate(new Date());
    }, 1000);
  }, [currentDate]);

  const formatTime = (date) => {
    const duration = formatDuration(
      intervalToDuration({ start: currentDate, end: date })
    )
      .replace(
        /\b(years?|months?|days?|hours?|minutes?|seconds?)\b/g,
        (match) => match[0]
      )
      .replace(/(\d)\s+([a-zA-Z])/g, '$1$2');

    return isAfter(currentDate, finishDate) ? 'Finished' : duration;
  };
  const progressPercentage = () => {
    const totalDuration =
      new Date(finishDate).getTime() - new Date(startDate).getTime();
    const elapsedDuration =
      new Date(currentDate).getTime() - new Date(startDate).getTime();

    if (elapsedDuration < 0) return 0;
    if (elapsedDuration > totalDuration) return 100;

    return (elapsedDuration / totalDuration) * 100;
  };
  const remainingReminder = () => {
    const totalDuration =
      new Date(finishDate).getTime() - new Date(startDate).getTime();
    const elapsedDuration =
      new Date(reminderDate).getTime() - new Date(startDate).getTime();
    const isReminder = isAfter(reminderDate, currentDate) ? 'block' : 'none';

    if (elapsedDuration < 0) return { isReminder, percentage: 0 };
    if (elapsedDuration > totalDuration) return { isReminder, percentage: 100 };

    return {
      isReminder,
      percentage: (elapsedDuration / totalDuration) * 100,
    };
  };

  return (
    <div className={styles.item}>
      <div
        className={styles.progressBar}
        style={{ width: `${progressPercentage()}%` }}
      ></div>
      <div
        className={styles.reminderBar}
        style={{
          left: `${remainingReminder().percentage}%`,
          display: remainingReminder().isReminder,
        }}
      ></div>
      <div className={styles.info}>
        <h3>{name}</h3>
        <p className={styles.time}>{formatTime(finishDate)}</p>
      </div>
    </div>
  );
};

export default EventItem;
