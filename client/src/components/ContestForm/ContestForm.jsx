import React, { useEffect, useCallback } from 'react';
import { Form, Formik } from 'formik';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CONSTANTS from '../../constants';
import { getDataForContest } from '../../store/slices/dataForContestSlice';
import styles from './ContestForm.module.sass';
import Spinner from '../Spinner/Spinner';
import FormInput from '../InputComponents/FormInput/FormInput';
import SelectInput from '../SelectInput/SelectInput';
import FieldFileInput from '../InputComponents/FieldFileInput/FieldFileInput';
import FormTextArea from '../InputComponents/FormTextArea/FormTextArea';
import TryAgain from '../TryAgain/TryAgain';
import Schems from '../../utils/validators/validationSchems';
import OptionalSelects from './OptionalSelects/OptionalSelects';

const variableOptions = {
  [CONSTANTS.NAME_CONTEST]: {
    styleName: '',
    typeOfName: '',
  },
  [CONSTANTS.LOGO_CONTEST]: {
    nameVenture: '',
    brandStyle: '',
  },
  [CONSTANTS.TAGLINE_CONTEST]: {
    nameVenture: '',
    typeOfTagline: '',
  },
};

const ContestForm = (props) => {
  const {
    contestType,
    getData,
    initialValues,
    handleSubmit,
    formRef,
    isEditContest,
    dataForContest: { isFetching, error, data },
  } = props;

  const inputClasses = {
    inputHeader: styles.labelTitle,
    inputContainer: styles.inputContainer,
    warning: styles.warning,
  };

  const getPreference = useCallback(() => {
    switch (contestType) {
      case CONSTANTS.NAME_CONTEST: {
        getData({
          characteristic1: 'nameStyle',
          characteristic2: 'typeOfName',
        });
        break;
      }
      case CONSTANTS.TAGLINE_CONTEST: {
        getData({ characteristic1: 'typeOfTagline' });
        break;
      }
      case CONSTANTS.LOGO_CONTEST: {
        getData({ characteristic1: 'brandStyle' });
        break;
      }
      default:
        console.error('Invalid contest type');
    }
  }, [contestType, getData]);

  useEffect(() => {
    getPreference();
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', unloadCallback);
    return () => window.removeEventListener('beforeunload', unloadCallback);
  }, [getPreference]);

  if (error) {
    return <TryAgain getData={getPreference} />;
  }
  if (isFetching) {
    return <Spinner />;
  }

  if (!data.industry) return <p>Loading industries...</p>;

  return (
    <>
      <div className={styles.formContainer}>
        <Formik
          initialValues={{
            title: '',
            industry: data?.industry[0] || '',
            focusOfWork: '',
            targetCustomer: '',
            file: '',
            domain: 1,
            ...variableOptions[contestType],
            ...initialValues,
          }}
          onSubmit={handleSubmit}
          validationSchema={Schems.ContestSchem}
          innerRef={formRef}
          enableReinitialize
        >
          {({ values }) => (
            <Form>
              <FormInput
                name="title"
                type="text"
                label="Title"
                header="Title of contest"
                classes={{
                  ...inputClasses,
                  input: styles.input,
                }}
              />
              <SelectInput
                name="industry"
                header="Describe industry associated with your venture"
                classes={{
                  ...inputClasses,
                  input: styles.select,
                }}
                optionsArray={data?.industry || []}
              />
              <FormTextArea
                name="focusOfWork"
                type="text"
                header="What does your company / business do?"
                label="e.g. We`re an online lifestyle brand that provides stylish and high quality apparel to the expert eco-conscious shopper"
                classes={{
                  ...inputClasses,
                  input: styles.textArea,
                }}
              />
              <FormTextArea
                name="targetCustomer"
                type="text"
                header="Tell us about your customers"
                label="customers"
                classes={{
                  ...inputClasses,
                  input: styles.textArea,
                }}
              />
              <OptionalSelects
                {...props}
                formData={values}
                classes={{
                  inputClasses,
                }}
              />
              <FieldFileInput
                name="file"
                classes={{
                  fileUploadContainer: styles.fileUploadContainer,
                  labelClass: styles.label,
                  fileBlockClass: styles.fileBlock,
                  fileNameClass: styles.fileName,
                  fileInput: styles.fileInput,
                  warning: styles.warning,
                }}
                type="file"
              />
              {isEditContest ? (
                <button type="submit" className={styles.changeData}>
                  Set Data
                </button>
              ) : null}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

const mapStateToProps = (state, ownProps) => {
  const { isEditContest } = state.contestByIdStore;
  return {
    isEditContest,
    contestCreationStore: state.contestCreationStore,
    dataForContest: state.dataForContest,
    initialValues: ownProps.defaultData,
  };
};
const mapDispatchToProps = (dispatch) => ({
  getData: (data) => dispatch(getDataForContest(data)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ContestForm)
);
