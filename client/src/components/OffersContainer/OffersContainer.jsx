import React from 'react';
import styles from './OffersContainer.module.sass';

const OffersContainer = (props) => {
  const { children } = props;

  return (
    <div className={styles.offerContainer}>
      {children.length !== 0 ? (
        <div className={styles.offersList}>{children}</div>
      ) : (
        <div className={styles.emptyNotification}>At the moment, list of offers is empty!</div>
      )}
    </div>
  );
};

export default OffersContainer;
