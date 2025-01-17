import React, { useEffect } from 'react';
import classNames from 'classnames';
import { MdOutlineAccessTime } from "react-icons/md";
import styles from './EventNotification.module.sass';
import useCurrentDate from '../../../hooks/useCurrentDate';
import { Link } from 'react-router-dom';

const EventNotification = (props) => {
  const { style, checkTime } = props;
  const { finishedCount, reminderCount } = props.counts;
  const currentDate = useCurrentDate();

  useEffect(() => {
    checkTime(currentDate.getTime());
  }, [currentDate, checkTime]);

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
