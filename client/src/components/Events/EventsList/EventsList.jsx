import React from 'react';
import _ from 'lodash';
import styles from './EventsList.module.sass';
import EventItem from './EventItem/EventItem';

const EventsList = (props) => {
  const { events } = props;
  const sortedEvents = _(events)
    .sortBy(event => new Date(event.finishDate).getTime())
    .partition(event => new Date(event.finishDate).getTime() >= new Date().getTime())
    .flatMap(partition => partition)
    .value();
    
  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <h2>Live upcoming checks</h2>
        <div>
          <p className={styles.remaining}>Remaining time</p>
          <img src="" alt="" />
        </div>
      </div>
      <div className={styles.eventsList}>
        {sortedEvents
          .map(event => (
            <EventItem event={event} />
          ))}
      </div>
    </div>
  );
};

export default EventsList;
