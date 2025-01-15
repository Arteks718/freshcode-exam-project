import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import { isAfter } from 'date-fns';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import styles from './EventItem.module.sass';
import useCurrentDate from '../../../../hooks/useCurrentDate.jsx';
import {
  formatTimeRemaining,
  calculateProgress,
} from '../../../../utils/dateUtils.js';

const EventItem = (props) => {
  const { deleteEvent } = props;
  const { name, finishDate, reminderDate, startDate, id } = props.event;

  const [isHoverItem, setIsHoverItem] = useState(false);
  const [isShownDelete, setIsShownDelete] = useState(false);

  const currentDate = useCurrentDate();

  const formattedTime = useMemo(() => {
    return isAfter(currentDate, finishDate)
      ? 'Finished'
      : formatTimeRemaining(currentDate, finishDate);
  }, [currentDate, finishDate]);

  const progressPercentage = useMemo(() => {
    return calculateProgress(startDate, currentDate, finishDate);
  }, [startDate, currentDate, finishDate]);

  const reminderProgressPercentage = useMemo(() => {
    return calculateProgress(startDate, reminderDate, finishDate);
  }, [startDate, reminderDate, finishDate]);

  return (
    <div className={styles.container} key={id}>
      <div
        className={styles.item}
        onMouseEnter={() => setIsHoverItem(true)}
        onMouseLeave={() => {
          if (!isShownDelete) setIsHoverItem(false);
        }}
      >
        <div
          className={styles.progressBar}
          style={{ width: `${progressPercentage}%` }}
        ></div>
        <div
          className={styles.reminderBar}
          style={{
            left: `${reminderProgressPercentage}%`,
            display: isAfter(reminderDate, currentDate) ? 'block' : 'none',
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
              {formattedTime}
            </p>
            <button
              className={classNames({
                [styles.deleteButton]: true,
                [styles.active]: isHoverItem,
              })}
              onClick={() => {
                setIsShownDelete(true);
                setIsHoverItem(true);
              }}
            >
              <FaTrashAlt size="16px" />
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
            <FaCheck size="14px" />
          </button>
          <button
            className={styles.reject}
            onClick={() => {
              setIsShownDelete(false);
              setIsHoverItem(false);
            }}
          >
            <IoCloseSharp size="18px" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
