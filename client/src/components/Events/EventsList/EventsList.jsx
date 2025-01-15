import React, { useMemo } from 'react';
import { MdOutlineAccessTime } from "react-icons/md";
import styles from './EventsList.module.sass';
import EventItem from './EventItem/EventItem';
import { sortEvents } from '../../../utils/formatUtils';

const EventsList = (props) => {
  const { events, deleteEvent } = props;
  const sortedEvents = useMemo(() => { return sortEvents(events) }, [events]);

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <h2>Live upcoming checks</h2>
        <div className={styles.remainingBlock}>
          <p className={styles.remainingText}>Remaining time</p>
          <MdOutlineAccessTime size="24" />
        </div>
      </div>
      <div className={styles.eventsList}>
        {events.length !== 0 ? (
          sortedEvents.map((event) => (
            <EventItem event={event} deleteEvent={deleteEvent} />
          ))
        ) : (
          <p>No events</p>
        )}
      </div>
    </div>
  );
};

export default EventsList;

