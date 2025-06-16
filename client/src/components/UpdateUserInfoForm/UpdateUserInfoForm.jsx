import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { clearUserError } from '../../store/slices/userSlice';
import styles from './UpdateUserInfoForm.module.sass';
import ImageUpload from '../InputComponents/ImageUpload/ImageUpload';
import FormInput from '../InputComponents/FormInput/FormInput';
import Schems from '../../utils/validators/validationSchems';
import Error from '../Error/Error';
import CONSTANTS from '../../constants';

const UpdateUserInfoForm = (props) => {
  const { onSubmit, submitting, error, clearUserError, initialValues } = props;

  return (
    <Formik
      onSubmit={onSubmit}
      initialValues={initialValues}
      validationSchema={Schems.UpdateUserSchema}
    >
      <Form className={styles.updateContainer}>
        {error && (
          <Error
            data={error.data}
            status={error.status}
            clearError={clearUserError}
          />
        )}
        <ImageUpload
          name="file"
          classes={{
            uploadContainer: styles.imageUploadContainer,
            inputContainer: styles.uploadInputContainer,
            imgStyle: styles.imgStyle,
          }}
        />

        <FormInput
          name="firstName"
          type="text"
          label="First Name"
          header={'First Name'}
          classes={{
            inputContainer: styles.inputContainer,
            input: styles.input,
            inputHeader: styles.label,
            warning: styles.error,
            notValid: styles.notValid,
          }}
        />
        <FormInput
          name="lastName"
          type="text"
          label="Last Name"
          header={'Last Name'}
          classes={{
            inputContainer: styles.inputContainer,
            input: styles.input,
            inputHeader: styles.label,
            warning: styles.error,
            notValid: styles.notValid,
          }}
        />
        <FormInput
          name="displayName"
          type="text"
          label="Display Name"
          header={'Display Name'}
          classes={{
            inputContainer: styles.inputContainer,
            input: styles.input,
            inputHeader: styles.label,
            warning: styles.error,
            notValid: styles.notValid,
          }}
        />

        <button type="submit" disabled={submitting}>
          Submit
        </button>
      </Form>
    </Formik>
  );
};

const mapStateToProps = (state) => {
  const { data, error } = state.userStore;
  return {
    error,
    initialValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      file:
        data.avatar === 'anon.png'
          ? CONSTANTS.ANONYM_IMAGE_PATH
          : `${CONSTANTS.publicURL}${data.avatar}`,
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  clearUserError: () => dispatch(clearUserError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateUserInfoForm);
