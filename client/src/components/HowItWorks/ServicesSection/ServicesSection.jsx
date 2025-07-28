import styles from './ServicesSection.module.sass';
import HOW_IT_WORKS_CONSTANTS from '../howItWorksConstants';
import ServicesItem from './ServicesItem/ServicesItem';

const ServicesSection = () => {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.servicesContainer}>
        <div className={styles.titleContainer}>
          <span className={styles.tag}>Our Services</span>
          <h2 className={styles.title}>3 Ways To Use Atom</h2>
          <p className={styles.desc}>
            Atom offers 3 ways to get you a perfect name for your business.
          </p>
        </div>
        <div className={styles.servicesList}>
          {HOW_IT_WORKS_CONSTANTS.services.map((item, index) => (
            <ServicesItem data={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
