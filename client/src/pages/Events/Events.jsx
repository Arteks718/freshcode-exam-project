import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventsForm from '../../components/Events/EventsForm/EventsForm';
import styles from './Events.module.sass';
import EventsList from '../../components/Events/EventsList/EventsList';
import { connect } from 'react-redux';

const Events = (props) => {
  const { events, loading } = props;
  return (
    <>
      <Header />
      <div className={styles.container}>
        <EventsForm />
        <EventsList events={events} />
      </div>
      <Footer />
    </>
  );
};


const mapStateToProps = state => state.eventStore;

export default connect(mapStateToProps)(Events);
