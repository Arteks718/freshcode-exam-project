import { connect } from 'react-redux';
import LoginForm from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.sass';
import { clearAuthError } from '../../store/slices/authSlice';
import AuthorizationHeader from '../../components/AuthorizationHeader/AuthorizationHeader';

const LoginPage = (props) => {
  props.clearError();
  return (
    <div className={styles.mainContainer}>
      <AuthorizationHeader linkTo="/registration" buttonTitle="Sign Up">
        <LoginForm history={props.history} />
      </AuthorizationHeader>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  clearError: () => dispatch(clearAuthError()),
});

export default connect(null, mapDispatchToProps)(LoginPage);
