import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import EventsForm from '../../components/Events/EventsForm/EventsForm';
import styles from './Events.module.sass';

const Events = () => {
  return (
    <>
      <Header />
      <div className={styles.container}>
        <EventsForm />
      </div>
      <Footer />
    </>
  );
};

export default Events;
