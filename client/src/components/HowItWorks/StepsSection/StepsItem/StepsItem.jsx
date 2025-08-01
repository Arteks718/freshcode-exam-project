import styles from './StepsItem.module.sass';

const StepsItem = (props) => {
  const { stepNumber, stepDesc } = props;
  return (
    <div className={styles.stepsItem}>
      <span className={styles.stepNumber}>Step {stepNumber}</span>
      <p>{stepDesc}</p>
        <img
          className={styles.stepArrow}
          src="https://www.atom.com/html/html/html/static_images/contests/arrow-right.svg"
          alt="arrow"
        />
    </div>
  );
};

export default StepsItem;
