import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import Error from '../Error/Error';
import { checkAuth, clearAuth } from '../../store/slices/authSlice';
import styles from './RegistrationForm.module.sass';
import FormInput from '../InputComponents/FormInput/FormInput';
import RoleInput from '../RoleInput/RoleInput';
import AgreeTermOfServiceInput from '../AgreeTermOfServiceInput/AgreeTermOfServiceInput';
import CONSTANTS from '../../constants';
import Schems from '../../utils/validators/validationSchems';

const RegistrationForm = (props) => {
  const { authClear, register, history, submitting } = props;
  const { error, isFetching } = props.auth;

  useEffect(() => {
    return () => {
      authClear();
    };
  }, [authClear]);

  const clicked = (values) => {
    register({
      data: {
        firstName: values.firstName,
        lastName: values.lastName,
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        role: values.role,
      },
      history,
    });
  };

  const formInputClasses = {
    inputContainer: styles.inputContainer,
    input: styles.input,
    warning: styles.fieldWarning,
    notValid: styles.notValid,
    valid: styles.valid,
  };

  return (
    <div className={styles.signUpFormContainer}>
      {error && (
        <Error data={error.data} status={error.status} clearError={authClear} />
      )}
      <div className={styles.headerFormContainer}>
        <h2>CREATE AN ACCOUNT</h2>
        <h4>We always keep your name and email address private.</h4>
      </div>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          displayName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: CONSTANTS.CUSTOMER,
          agreeOfTerms: false,
        }}
        onSubmit={clicked}
        validationSchema={Schems.RegistrationSchem}
      >
        <Form>
          <div className={styles.inputsContainer}>
            <FormInput
              name="firstName"
              classes={formInputClasses}
              type="text"
              label="First name"
            />
            <FormInput
              name="lastName"
              classes={formInputClasses}
              type="text"
              label="Last name"
            />

            <FormInput
              name="displayName"
              classes={formInputClasses}
              type="text"
              label="Display Name"
            />
            <FormInput
              name="email"
              classes={formInputClasses}
              type="email"
              label="Email Address"
            />

            <FormInput
              name="password"
              classes={formInputClasses}
              type="password"
              label="Password"
            />
            <FormInput
              name="confirmPassword"
              classes={formInputClasses}
              type="password"
              label="Password confirmation"
            />
          </div>

          <div className={styles.choseRoleContainer}>
            <Field
              name="role"
              type="radio"
              value={CONSTANTS.CUSTOMER}
              strRole="Join As a Buyer"
              infoRole="I am looking for a Name, Logo or Tagline for my business, brand or product."
              component={RoleInput}
              id={CONSTANTS.CUSTOMER}
            />
            <Field
              name="role"
              type="radio"
              value={CONSTANTS.CREATOR}
              strRole="Join As a Creative"
              infoRole="I plan to submit name ideas, Logo designs or sell names in Domain Marketplace."
              component={RoleInput}
              id={CONSTANTS.CREATOR}
            />
          </div>
          <div className={styles.termsOfService}>
            <AgreeTermOfServiceInput
              name="agreeOfTerms"
              classes={{
                container: styles.termsOfService,
                warning: styles.fieldWarning,
              }}
              id="termsOfService"
              type="checkbox"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitContainer}
          >
            Create Account
          </button>
        </Form>
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  initialValues: {
    role: CONSTANTS.CUSTOMER,
  },
});

const mapDispatchToProps = (dispatch) => ({
  register: ({ data, history }) =>
    dispatch(
      checkAuth({ data, history, authMode: CONSTANTS.AUTH_MODE.REGISTER })
    ),
  authClear: () => dispatch(clearAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
