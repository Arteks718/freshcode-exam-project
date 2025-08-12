import { Formik, Form } from 'formik';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import FormInput from '../../InputComponents/FormInput/FormInput';
import styles from './EventsForm.module.sass';
import validationSchems from '../../../utils/validators/validationSchems';

const EventsForm = (props) => {
  const { addEvent, userId } = props;
  const validationSchema = validationSchems.EventsSchema;
  const dateTimePickerTheme = {
    bgcolor: '#fff',
    width: '100%',
  };

  return (
    <div>
      <Formik
        initialValues={{
          id: '',
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
          const newEvent = {
            ...values,
            id: Date.now().toString(),
            startDate: values.startDate.getTime(),
            finishDate: values.finishDate?.getTime(),
            reminderDate: values.reminderDate?.getTime(),
          };
          addEvent({ event: newEvent, userId });
          resetForm();
        }}
      >
        {({
          values,
          setFieldValue,
          setFieldTouched,
          resetForm,
          errors,
          touched,
        }) => {
          const handleChangeFinishDate = async (value) => {
            await setFieldValue('finishDate', value);
            setFieldTouched('finishDate', true, true);
          };
          const handleChangeReminderDate = async (value) => {
            await setFieldValue('reminderDate', value);
            setFieldTouched('reminderDate', true, true);
          };
          return (
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
                      sx={dateTimePickerTheme}
                      value={values.finishDate}
                      disablePast
                      disableIgnoringDatePartForTimeValidation={true}
                      onChange={(value) => handleChangeFinishDate(value)}
                      slotProps={{
                        textField: {
                          error: Boolean(
                            errors.finishDate && touched.finishDate
                          ),
                          helperText: touched.finishDate && errors.finishDate,
                        },
                      }}
                    />
                  </div>
                  <div className={styles.inputContainer}>
                    <span className={styles.labelTitle}>Reminder Date</span>
                    <DateTimePicker
                      name="reminderDate"
                      sx={dateTimePickerTheme}
                      value={values.reminderDate}
                      disablePast
                      maxDateTime={values.finishDate}
                      onChange={(value) => handleChangeReminderDate(value)}
                      slotProps={{
                        textField: {
                          error: Boolean(
                            errors.reminderDate && touched.reminderDate
                          ),
                          helperText:
                            touched.reminderDate && errors.reminderDate,
                        },
                      }}
                    />
                  </div>
                </div>
              </LocalizationProvider>
              <div className={styles.buttons}>
                <button
                  className={styles.clearButton}
                  type="button"
                  onClick={() => resetForm()}
                >
                  Clear
                </button>
                <button type="submit" className={styles.addButton}>
                  Add
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default EventsForm;