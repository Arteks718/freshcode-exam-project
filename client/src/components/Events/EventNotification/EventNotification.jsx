import React, { useEffect } from 'react';
import classNames from 'classnames';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './EventNotification.module.sass';
import useCurrentDate from '../../../hooks/useCurrentDate';

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
        <a href="/events">
          <AccessTimeIcon className={style.icon} alt="event" />
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
        </a>
      </div>
    </>
  );
};

export default EventNotification;
