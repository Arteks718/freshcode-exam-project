import React from 'react';
import styles from './ServicesItem.module.sass';

const ServicesItem = (props) => {
  const { icon, title, description, buttonText } = props.data;
  return (
    <div className={styles.item}>
      <div>
        <div className={styles.icon}>
          <img src={icon} alt="icon" />
        </div>
        <h3 className={styles.itemTitle}>{title}</h3>
        <p className={styles.itemDesc}>{description}</p>
      </div>
      <div>
        <button className={styles.itemButton}>
          {buttonText}
          <img
            alt="test"
            src="https://www.atom.com/html/html/html/static_images/icon-arrow-long-right.svg"
          ></img>
        </button>
      </div>
    </div>
  );
};

export default ServicesItem;
