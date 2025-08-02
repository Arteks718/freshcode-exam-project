import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import { checkAuth, clearAuth } from '../../store/slices/authSlice';
import styles from './LoginForm.module.sass';
import FormInput from '../InputComponents/FormInput/FormInput';
import Schems from '../../utils/validators/validationSchems';
import Error from '../Error/Error';
import CONSTANTS from '../../constants';

const LoginForm = (props) => {
  const { authClear, history, submitting, loginRequest } = props;
  const { error, isFetching } = props.auth;

  useEffect(() => {
    if (localStorage.getItem('token')) {
      loginRequest();
    }
    return authClear;
  }, [loginRequest, authClear]);

  const clicked = (values) => {
    loginRequest({ data: values, history });
  };

  const formInputClasses = {
    inputContainer: styles.inputContainer,
    input: styles.input,
    warning: styles.warning,
    notValid: styles.notValid,
    valid: styles.valid,
  };

  return (
    <div className={styles.loginForm}>
      {error && (
        <Error data={error.data} status={error.status} clearError={authClear} />
      )}
      <h2>LOGIN TO YOUR ACCOUNT</h2>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={clicked}
        validationSchema={Schems.LoginSchem}
      >
        <Form>
          <FormInput
            classes={formInputClasses}
            name="email"
            type="text"
            label="Email Address"
          />
          <FormInput
            classes={formInputClasses}
            name="password"
            type="password"
            label="Password"
          />
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitContainer}
          >
            <span className={styles.inscription}>
              {isFetching ? 'Submitting...' : 'LOGIN'}
            </span>
          </button>
        </Form>
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { auth } = state;
  return { auth };
};

const mapDispatchToProps = (dispatch) => ({
  loginRequest: ({ data, history }) =>
    dispatch(checkAuth({ data, history, authMode: CONSTANTS.AUTH_MODE.LOGIN })),
  authClear: () => dispatch(clearAuth()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
