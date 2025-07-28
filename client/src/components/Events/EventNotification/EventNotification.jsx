import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { MdOutlineAccessTime } from 'react-icons/md';
import styles from './EventNotification.module.sass';
import useCurrentDate from '../../../hooks/useCurrentDate';
import { Link } from 'react-router-dom';
import CONSTANTS from '../../../constants';

const EventNotification = (props) => {
  const { style, checkTime, role, events } = props;
  const { finishedCount, reminderCount } = props.counts;
  const currentDate = useCurrentDate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    checkTime(currentDate)
  }, [])

  useEffect(() => {
    if (role === CONSTANTS.CUSTOMER) {
      const nextEventTime = events.reduce((nextTime, event) => {
        const reminderTime = new Date(event.reminderDate);
        const finishTime = new Date(event.finishDate);

        if (reminderTime > currentDate && (nextTime === null || reminderTime < nextTime)) {
          return reminderTime;
        }
        if (finishTime > currentDate && (nextTime === null || finishTime < nextTime)) {
          return finishTime;
        }
        return nextTime;
      }, null);

      if (nextEventTime !== null) {
        const delay = nextEventTime - currentDate;
        timeoutRef.current = setTimeout(() => {
          checkTime(currentDate);
        }, delay);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentDate, checkTime, role, events]);

  if (role !== CONSTANTS.CUSTOMER) {
    return null;
  }

  return (
    <>
      <div className={styles.notificationBlock}>
        <Link to="/events">
          <MdOutlineAccessTime className={style.icon} alt="event" />
          {finishedCount > 0 && (
            <span
              className={classNames([
                styles.notificationCount,
                styles.finished,
              ])}
            >
              {finishedCount}
            </span>
          )}
          {reminderCount > 0 && (
            <span
              className={classNames([
                styles.notificationCount,
                styles.reminder,
              ])}
            >
              {reminderCount}
            </span>
          )}
        </Link>
      </div>
    </>
  );
};

export default EventNotification;