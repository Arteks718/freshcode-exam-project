import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import ServicesSection from '../../components/HowItWorks/ServicesSection/ServicesSection';
import HomeHero from '../../components/HowItWorks/HomeHeroSection/HomeHeroSection';
import StepsSection from '../../components/HowItWorks/StepsSection/StepsSection';
import FAQSection from '../../components/HowItWorks/FAQSection/FAQSection';
import { connect } from 'react-redux';

const HowItWorks = (props) => {
  return (
    <>
      <Header />
      <HomeHero />
      <ServicesSection />
      <StepsSection />
      <FAQSection />
      <Footer />
    </>
  );
};

export default connect(null, null)(HowItWorks);
