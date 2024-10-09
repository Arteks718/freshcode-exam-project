import React from 'react';
import styles from './StepsSection.module.sass';
import StepsItem from './StepsItem/StepsItem';
import HOW_IT_WORKS_CONSTANTS from '../howItWorksConstants';

const StepsSection = () => {
  const { steps } = HOW_IT_WORKS_CONSTANTS;
  return (
    <section className={styles.stepsSection}>
      <div className={styles.stepsContainer}>
        <div className={styles.titleContainer}>
          <img
            src="https://www.atom.com/resources/assets/svg/icons/icon-27.svg"
            alt=""
          />
          <h3>How Do Naming Contests Work?</h3>
        </div>
        <div className={styles.stepsList}>
          {steps.map((item, index) => {
            return (
              <StepsItem key={index} stepNumber={index + 1} stepDesc={item} />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
