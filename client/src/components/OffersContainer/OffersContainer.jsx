import React from 'react';
import styles from './OffersContainer.module.sass';

const OffersContainer = (props) => {
  const { children } = props;
  console.log(children);
  return (
    <div className={styles.offerContainer}>
      {/* <span className={styles.title}>Offers list</span> */}
      <div className={styles.offersList}>{children}</div>
    </div>
  );
};

export default OffersContainer;
