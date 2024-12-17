import React from 'react';
import _ from 'lodash';
import styles from './EventsList.module.sass';
import EventItem from './EventItem/EventItem';

const EventsList = (props) => {
  const { events } = props;
  console.log(events)
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
        {_.sortBy(events, (event) => new Date(event.finishDate).getTime())
          .map(event => (
            <EventItem event={event} />
          ))}
      </div>
    </div>
  );
};

export default EventsList;
