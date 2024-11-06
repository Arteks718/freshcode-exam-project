import React from 'react';
import { Field } from 'formik';
import { FaCheck } from "react-icons/fa";
import classNames from 'classnames';

const Button = (props) => {
  const { name, classes, data, active } = props;
  const { answer, description, recommended, answerId } = data;

  const buttonClasses = classNames(classes.button, {
    [classes.active]: active,
  });

  return (
    <label className={buttonClasses}>
      <Field
        type="radio"
        name={name}
        value={answerId}
        style={{ display: 'none' }}
      />
      {recommended && (
        <span className={classes.recommendedMessage}>Recommended</span>
      )}
      <span className={classes.buttonAnswer}>{answer}</span>
      <p className={classes.buttonDescription}>{description}</p>
      {active && <FaCheck className={classes.arrow} />}
    </label>
  );
};

export default Button;
