import styles from './Footer.module.sass';
import CONSTANTS from '../../constants';

const Footer = () => {
  const topFooterRender = () =>
    CONSTANTS.FOOTER_ITEMS.map((item) => (
      <div key={item.title} className={styles.list}>
        <h4 className={styles.listTitle}>{item.title}</h4>
        {item.items.map((subItem) => (
          <a key={subItem.title} href={subItem.link || '/404'} className={styles.listItem}>
            {subItem.title}
          </a>
        ))}
      </div>
    ));

  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerTop}>
        <div className={styles.footerTopContainer}>{topFooterRender()}</div>
      </div>
    </div>
  );
};

export default Footer;
