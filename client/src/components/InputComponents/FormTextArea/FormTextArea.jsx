import React from 'react';
import classNames from 'classnames';
import { Field, ErrorMessage } from 'formik';

const FormTextArea = ({ label, classes, type, header, ...rest }) => (
  <Field {...rest}>
    {(props) => {
      const {
        field,
        meta: { touched, error },
      } = props;
      const { inputContainer, input, notValid, warning } = classes;
      return (
        <div className={inputContainer}>
          <span className={classes.inputHeader}>{header}</span>

          <textarea
            {...field}
            placeholder={label}
            className={classNames(input, {
              [notValid]: touched && error,
            })}
          />
          <ErrorMessage
            name={field.name}
            component="span"
            className={warning}
          />
        </div>
      );
    }}
  </Field>
);

export default FormTextArea;
