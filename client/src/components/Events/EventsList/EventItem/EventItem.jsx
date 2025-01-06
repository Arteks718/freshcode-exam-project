import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { intervalToDuration, formatDuration, isAfter } from 'date-fns';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import styles from './EventItem.module.sass';

const EventItem = (props) => {
  const { deleteEvent } = props;
  const { name, finishDate, reminderDate, startDate, id } = props.event;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHoverItem, setIsHoverItem] = useState(false);
  const [isShownDelete, setIsShownDelete] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    <div className={styles.container}>
      <div
        className={styles.item}
        onMouseEnter={() => setIsHoverItem(true)}
        onMouseLeave={() => setIsHoverItem(false)}
      >
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
        <div className={styles.eventInfo}>
          <h3>{name}</h3>
          <div className={styles.info}>
            <p
              className={classNames({
                [styles.time]: true,
                [styles.margin]: isHoverItem,
              })}
            >
              {formatTime(finishDate)}
            </p>
            <button
              className={classNames({
                [styles.deleteButton]: true,
                [styles.active]: isHoverItem,
              })}
              onClick={() => setIsShownDelete(true)}
            >
              <DeleteForeverOutlinedIcon />
            </button>
          </div>
        </div>
      </div>
      <div
        className={classNames({
          [styles.warning]: true,
          [styles.visible]: isShownDelete,
        })}
      >
        <p>Are you sure?</p>
        <div className={styles.buttons}>
          <button className={styles.accept} onClick={() => deleteEvent(id)}>
            <CheckOutlinedIcon />
          </button>
          <button
            className={styles.reject}
            onClick={() => setIsShownDelete(false)}
          >
            <CloseOutlinedIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
