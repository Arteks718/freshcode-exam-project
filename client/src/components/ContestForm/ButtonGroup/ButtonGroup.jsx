import Button from './Button/Button';
import styles from './ButtonGroup.module.sass'

const ButtonGroup = (props) => {
  const { classes, optionsArray, activeButton, header } = props;

  return (
    <div>
      <span className={classes.inputHeader}>{header}</span>
      <div className={styles.buttonGroup}>
        {optionsArray.map((option, index) => {
          return (
            <Button
              key={index}
              name={'domain'}
              classes={styles}
              data={option}
              active={Number(activeButton) === option.answerId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ButtonGroup;
