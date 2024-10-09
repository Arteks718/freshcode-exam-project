import React from 'react';
import styles from './HomeHeroSection.module.sass';
import HOW_IT_WORKS_CONSTANTS from '../howItWorksConstants';

const HomeHeroSection = () => {
  return (
    <section className={styles.homeHeroSection}>
      <div className={styles.homeHeroContainer}>
        <div className={styles.textBlock}>
          <h4 className={styles.tag}>World's #1 Naming Platform</h4>
          <h1 className={styles.title}>How Does Atom Work?</h1>
          <p className={styles.desc}>
            Atom helps you come up with a great name for your business by
            combining the power of sourcing with sophisticated technology and
            Agency-level validation services.
          </p>
        </div>
        <div className={styles.videoBlock}>
          <div className={styles.videoElement}>
            <iframe
              src={HOW_IT_WORKS_CONSTANTS.homeHeroSection.videoLink}
              title="heroVideo"
              loading="eager"
              allow="accelerometer; gyroscope; encrypted-media; picture-in-picture;"
              allowfullscreen="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHeroSection;
