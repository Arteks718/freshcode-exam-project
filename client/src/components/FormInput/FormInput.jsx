import React from 'react';
import { Field, ErrorMessage } from 'formik';
import classNames from 'classnames';

const FormInput = ({ classes, label, name, header, ...rest }) => (
  <Field name={name}>
    {(props) => {
      const {
        field,
        meta: { touched, error },
      } = props;

      const inputClassName = classNames(classes.input, {
        [classes.notValid]: touched && error,
        [classes.valid]: touched && !error,
      });
      return (
        <div className={classes.inputContainer}>
          <span className={classes.inputHeader}>{header}</span>

          <input
            type="text"
            {...field}
            placeholder={label}
            className={inputClassName}
            {...rest}
          />
          <ErrorMessage
            name={name}
            component="span"
            className={classes.warning}
          />
        </div>
      );
    }}
  </Field>
);

export default FormInput;
