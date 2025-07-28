import { useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import styles from './UserProfile.module.sass';
import CONSTANTS from '../../constants';
import Header from '../../components/Header/Header';
import UserInfo from '../../components/UserInfo/UserInfo';
import PaymentInfo from '../../components/PaymentInfo/PaymentInfo';
import { cashOut, clearPaymentStore } from '../../store/slices/paymentSlice';
import { changeProfileViewMode, resetState } from '../../store/slices/userProfileSlice';

const UserProfile = (props) => {
  const {
    balance,
    role,
    profileViewMode,
    error,
    changeProfileViewMode,
    clearPaymentStore,
    cashOut,
    resetProfileState
  } = props;

  useEffect(() => {
    return () => {
      resetProfileState()
    }
  }, [resetProfileState]);

  const optionTab = ({ optionName, viewMode }) => {
    return (
      <div
        className={classNames(styles.optionContainer, {
          [styles.currentOption]: profileViewMode === viewMode,
        })}
        onClick={() => changeProfileViewMode(viewMode)}
      >
        {optionName}
      </div>
    );
  };

  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        {role === CONSTANTS.CREATOR && (
          <div className={styles.aside}>
            <span className={styles.headerAside}>Select Option</span>
            <div className={styles.optionsContainer}>
              {optionTab({
                optionName: 'Profile',
                viewMode: CONSTANTS.USER_INFO_MODE,
              })}
              {optionTab({
                optionName: 'Cashout',
                viewMode: CONSTANTS.CASHOUT_MODE,
              })}
            </div>
          </div>
        )}

        {profileViewMode === CONSTANTS.USER_INFO_MODE ? (
          <UserInfo />
        ) : (
          <PaymentInfo
            balance={balance}
            cashOut={cashOut}
            error={error}
            clearPaymentStore={clearPaymentStore}
          />
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { profileViewMode } = state.userProfile;
  const { error } = state.payment;

  return {
    balance: state.userStore?.data?.balance,
    role: state.userStore?.data?.role,
    profileViewMode,
    error,
  };
};

const mapDispatchToProps = (dispatch) => ({
  cashOut: (data) => dispatch(cashOut(data)),
  changeProfileViewMode: (data) => dispatch(changeProfileViewMode(data)),
  clearPaymentStore: () => dispatch(clearPaymentStore()),
  resetProfileState: () => dispatch(resetState())
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
