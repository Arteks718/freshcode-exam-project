import { useCallback } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
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
    try {
      updateUser(formData);
      toast.success('User data updated successfully!');
    } catch (error) {
      toast.error('User data update failed!');
    }

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
      <button
        onClick={() => changeEditMode(!isEdit)}
        className={styles.buttonEdit}
      >
        {isEdit ? 'Cancel' : 'Edit'}
      </button>
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
