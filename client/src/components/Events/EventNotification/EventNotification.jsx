import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { MdOutlineAccessTime } from 'react-icons/md';
import styles from './EventNotification.module.sass';
import useCurrentDate from '../../../hooks/useCurrentDate';

const EventNotification = (props) => {
  const { style, checkTime, events } = props;
  const { finishedCount, reminderCount } = props.counts;
  const currentDate = useCurrentDate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    checkTime(currentDate);
  }, []);

  useEffect(() => {
    const futureTimes = events
      .flatMap((event) => [
        new Date(event.reminderDate),
        new Date(event.finishDate),
      ])
      .filter((date) => date > new Date());

    if (futureTimes.length > 0) {
      const nextEventTime = futureTimes.reduce(
        (min, date) => (date < min ? date : min),
        futureTimes[0]
      );
      const delay = nextEventTime - new Date();

      timeoutRef.current = setTimeout(() => {
        checkTime(new Date());
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [checkTime, events]);

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
