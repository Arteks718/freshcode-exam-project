import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './EventNotification.module.sass';
import CONSTANTS from '../../../constants';

const EventNotification = (props) => {
  const { role, style, checkTime, finishedCount, reminderCount } = props;
  useEffect(() => {
    const timer = setInterval(() => {
      checkTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      {role === CONSTANTS.CUSTOMER && (
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
      )}
    </>
  );
};

const mapStateToProps = (state) => state.eventStore;

export default connect(mapStateToProps)(EventNotification);
