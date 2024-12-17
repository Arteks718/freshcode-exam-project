import React from 'react'
import { intervalToDuration } from 'date-fns'
import styles from './EventItem.module.sass'

const EventItem = (props) => {
  const formatTime = (totalSeconds) => {
    // Перетворюємо загальну кількість секунд на тривалість
    const duration = intervalToDuration({ start: 0, end: totalSeconds * 1000 });
  
    // Форматуємо тривалість у потрібний формат
    const formattedTime = `${duration.hours}h ${duration.minutes}m ${duration.seconds}s`;
    
    return formattedTime;
  };

  const { name, finishDate, reminderDate, startDate } = props.event;
  return (
    <div className={styles.item}>
      <h3>{name}</h3>
      <p className={styles.time}>
        {formatTime(new Date(formatTime).getTime())}
      </p>
    </div>
  )
}

export default EventItem