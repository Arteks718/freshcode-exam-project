import React from 'react';
import { connect } from 'react-redux';
import { Form, Formik, useFormik } from 'formik';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import FormInput from '../../InputComponents/FormInput/FormInput';
import styles from './EventsForm.module.sass';
import validationSchems from '../../../utils/validators/validationSchems';

const EventsForm = (props) => {
  const { addEvent } = props;
  const validationSchema = validationSchems.EventsSchema;

  return (
    <div>
      <Formik
        initialValues={{
          id: new Date().getTime().toString(),
          name: '',
          startDate: new Date(),
          finishDate: null,
          reminderDate: null,
        }}
        validationSchema={validationSchema}
        validateOnMount={false}
        validateOnBlur={true}
        validateOnChange={false}
        onSubmit={(values, { resetForm }) => {
          addEvent(values);
          resetForm();
        }}
      >
        {({ values, setFieldValue, setFieldTouched }) => (
          <Form>
            <FormInput
              name={'name'}
              label={'Name of task'}
              header={'Name of task'}
              classes={{
                inputHeader: styles.labelTitle,
                inputContainer: styles.inputContainer,
                input: styles.input,
                warning: styles.warning,
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className={styles.datePickerContainer}>
                <div className={styles.inputContainer}>
                  <span className={styles.labelTitle}>Finish Date</span>
                  <DateTimePicker
                    name="finishDate"
                    className={styles.datePicker}
                    value={values.finishDate}
                    disablePast
                    onChange={(value) => {
                      setFieldValue('finishDate', value);
                      setFieldTouched('finishDate', true, true);
                    }}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <span className={styles.labelTitle}>Reminder Date</span>
                  <DateTimePicker
                    name="reminderDate"
                    className={styles.datePicker}
                    value={values.reminderDate}
                    disablePast
                    maxDateTime={values.finishDate}
                    onChange={(value) => {
                      setFieldValue('reminderDate', value);
                      setFieldTouched('reminderDate', true, true);
                    }}
                  />
                </div>
              </div>
            </LocalizationProvider>
            <button type="submit" className={styles.submitButton}>
              Add
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EventsForm;
