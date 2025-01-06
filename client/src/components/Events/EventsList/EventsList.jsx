import React from 'react';
import _, { isBoolean } from 'lodash';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import styles from './EventsList.module.sass';
import EventItem from './EventItem/EventItem';

const EventsList = (props) => {
  const { events, deleteEvent } = props;
  console.log(isBoolean(events));
  const sortedEvents = _(events)
    .sortBy((event) => new Date(event.finishDate).getTime())
    .partition(
      (event) => new Date(event.finishDate).getTime() >= new Date().getTime()
    )
    .flatMap((partition) => partition)
    .value();

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <h2>Live upcoming checks</h2>
        <div className={styles.remainingBlock}>
          <p className={styles.remainingText}>Remaining time</p>
          <AccessTimeIcon />
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
