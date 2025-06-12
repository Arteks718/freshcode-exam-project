import { useCallback } from 'react';
import { connect } from 'react-redux';
import UpdateUserInfoForm from '../UpdateUserInfoForm/UpdateUserInfoForm';
import { updateUser } from '../../store/slices/userSlice';
import { changeEditModeOnUserProfile } from '../../store/slices/userProfileSlice';
import CONSTANTS from '../../constants';
import styles from './UserInfo.module.sass';
import InfoBlock from './InfoBlock/InfoBlock';

const UserInfo = (props) => {
  const { isEdit, changeEditMode, data, updateUser } = props;
  const { avatar, firstName, lastName, displayName, email, role, balance } =
    data;

  const updateUserData = useCallback(({ file, firstName, lastName, displayName }) => {
    const formData = new FormData();

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('displayName', displayName);
    formData.append('file', file);

    updateUser(formData);
  }, [updateUser]);

  return (
    <div className={styles.mainContainer}>
      {isEdit ? (
        <UpdateUserInfoForm onSubmit={updateUserData} />
      ) : (
        <div className={styles.infoContainer}>
          <img
            src={
              avatar === 'anon.png'
                ? CONSTANTS.ANONYM_IMAGE_PATH
                : `${CONSTANTS.publicURL}${avatar}`
            }
            className={styles.avatar}
            alt="user"
          />
          <div className={styles.userInfoContainer}>
            <InfoBlock label={"First Name"} info={firstName} />
            <InfoBlock label={"Last Name"} info={lastName} />
            <InfoBlock label={"Display Name"} info={displayName} />
            <InfoBlock label={"Email"} info={email} />
            <InfoBlock label={"Role"} info={role} />
            {role === CONSTANTS.CREATOR && (
              <InfoBlock label={"Balance"} info={`${balance}$`} />
            )}
          </div>
        </div>
      )}
      <div
        onClick={() => changeEditMode(!isEdit)}
        className={styles.buttonEdit}
      >
        {isEdit ? 'Cancel' : 'Edit'}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { data } = state.userStore;
  const { isEdit } = state.userProfile;
  return { data, isEdit };
};

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(updateUser(data)),
  changeEditMode: (data) => dispatch(changeEditModeOnUserProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
