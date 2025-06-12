import styles from './InfoBlock.module.sass';
const InfoBlock = ({ label, info }) => (
  <div className={styles.infoBlock}>
    <span className={styles.label}>{label}</span>
    <span className={styles.info}>{info}</span>
  </div>
);

export default InfoBlock;
