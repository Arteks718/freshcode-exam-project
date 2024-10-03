import React from 'react';
import styles from './HowItWorks.module.sass';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ServicesSection from '../../components/HowItWorks/ServicesSection/ServicesSection';
import HomeHero from '../../components/HowItWorks/HomeHeroSection/HomeHeroSection';
import { connect } from 'react-redux';

const HowItWorks = (props) => {
  return (
    <>
      <Header />
      <HomeHero />
      <ServicesSection />
      <Footer />
    </>
  );
};

export default connect(null, null)(HowItWorks);
