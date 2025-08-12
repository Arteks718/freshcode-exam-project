import { connect } from 'react-redux';
import styles from './Events.module.sass';
import { addEventAsync, deleteEventAsync, getEventsAsync } from '../../store/slices/eventSlice';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventsForm from '../../components/Events/EventsForm/EventsForm';
import EventsList from '../../components/Events/EventsList/EventsList';
import { useEffect } from 'react';

const Events = (props) => {
  const { getEvents, deleteEvent, addEvent } = props
  const { events } = props.eventStore;
  const { id } = props.userStore?.data || '';

  useEffect(() => {
    getEvents(id);
  }, [getEvents, id])

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <EventsForm addEvent={addEvent} userId={id} />
          <EventsList events={events} deleteEvent={deleteEvent} userId={id} />
        </div>
      </div>
      <Footer />
    </>
  );
};

const mapStateToProps = (state) => {
  const { eventStore, userStore } = state;
  return { eventStore, userStore }
}
const mapDispatchToProps = (dispatch) => ({
  getEvents: (userId) => dispatch(getEventsAsync(userId)),
  addEvent: (payload) => dispatch(addEventAsync(payload)),
  deleteEvent: (payload) => dispatch(deleteEventAsync(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);
