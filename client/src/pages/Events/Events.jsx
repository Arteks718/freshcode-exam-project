import React from 'react';
import { connect } from 'react-redux';
import styles from './Events.module.sass';
import { addEvent, deleteEvent } from '../../store/slices/eventSlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventsForm from '../../components/Events/EventsForm/EventsForm';
import EventsList from '../../components/Events/EventsList/EventsList';

const Events = (props) => {
  const { events, loading, addEvent, deleteEvent } = props;
  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <EventsForm addEvent={addEvent} />
          <EventsList events={events} deleteEvent={deleteEvent} />
        </div>
      </div>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => state.eventStore;
const mapDispatchToProps = (dispatch) => ({
  addEvent: (event) => dispatch(addEvent(event)),
  deleteEvent: (id) => dispatch(deleteEvent(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);
