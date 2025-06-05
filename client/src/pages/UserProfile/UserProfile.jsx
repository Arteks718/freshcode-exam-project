import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Header from '../../components/Header/Header';
import styles from './UserProfile.module.sass';
import CONSTANTS from '../../constants';
import UserInfo from '../../components/UserInfo/UserInfo';
import { cashOut, clearPaymentStore } from '../../store/slices/paymentSlice';
import { changeProfileViewMode } from '../../store/slices/userProfileSlice';
import PaymentInfo from '../../components/PaymentInfo/PaymentInfo';

const UserProfile = (props) => {
  const {
    balance,
    role,
    profileViewMode,
    error,
    changeProfileViewMode,
    clearPaymentStore,
    cashOut,
  } = props;

  return (
    <div>
      <Header />
      <div className={styles.mainContainer}>
        {role === CONSTANTS.CREATOR && (
          <div className={styles.aside}>
            <span className={styles.headerAside}>Select Option</span>
            <div className={styles.optionsContainer}>
              <div
                className={classNames(styles.optionContainer, {
                  [styles.currentOption]:
                    profileViewMode === CONSTANTS.USER_INFO_MODE,
                })}
                onClick={() => changeProfileViewMode(CONSTANTS.USER_INFO_MODE)}
              >
                UserInfo
              </div>
              <div
                className={classNames(styles.optionContainer, {
                  [styles.currentOption]:
                    profileViewMode === CONSTANTS.CASHOUT_MODE,
                })}
                onClick={() => changeProfileViewMode(CONSTANTS.CASHOUT_MODE)}
              >
                Cashout
              </div>
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
  // const { balance, role } = state.userStore?.data;
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
});

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
