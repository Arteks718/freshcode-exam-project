import React, { Component } from 'react';
import styles from './Footer.module.sass';
import CONSTANTS from '../../constants';

const Footer = () => {
  const topFooterItemsRender = (item) => (
    <div key={item.title}>
      <h4>{item.title}</h4>
      {item.items.map((i) => (
        <a key={i} href="https://google.com">
          {i}
        </a>
      ))}
    </div>
  );

  const topFooterRender = () => {
    return CONSTANTS.FOOTER_ITEMS.map((item) => topFooterItemsRender(item));
  };

  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerTop}>
        <div>{topFooterRender()}</div>
      </div>
    </div>
  );
};

export default Footer;
