import React from 'react';
import { Form, Formik, useFormik } from 'formik';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import FormInput from '../../InputComponents/FormInput/FormInput';
import styles from './EventsForm.module.sass';

const EventsForm = () => {
  const formik = useFormik({
    initialValues: {
      departureTime: Date.now(),
    },
    // validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          finishDate: Date.now(),
          reminderDate: Date.now(),
        }}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <Form>
            <FormInput
              name={'name'}
              label={'Name of task'}
              header={'Name of task'}
              classes={{
                inputHeader: styles.labelTitle,
                inputContainer: styles.inputContainer,
                input: styles.input,
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <div className={styles.datePickerContainer}>
                <div className={styles.inputContainer}>
                  <span className={styles.labelTitle}>Finish Dat</span>
                  <DateTimePicker
                    name="finishDate"
                    value={values.finishDate}
                    onChange={(value) => {
                      setFieldValue('finishDate', value);
                    }}
                    className={styles.datePicker}
                    disablePastCheck={false}

                    // onError={}
                  />
                </div>
                <div className={styles.inputContainer}>
                  <span className={styles.labelTitle}>Reminder Date</span>
                  <DateTimePicker
                    name="reminderDate"
                    value={values.reminderDate}
                    onChange={(value) => {
                      setFieldValue('reminderDate', value);
                    }}
                    disablePastCheck={false}
                    className={styles.datePicker}
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

// import React from "react";
// import ReactDOM from "react-dom";
// import { Formik, Form } from "formik";
// import { Typography, Container, Button, Box } from "@material-ui/core";
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDatePicker
// } from "@material-ui/pickers";
// import DateFnsUtils from "@date-io/date-fns";
// import Grid from "@material-ui/core/Grid";
// import * as yup from "yup";

// const access = 2;
// const today = new Date().toDateString();
// const validationSchema = yup.object().shape({
//   access: yup.number().nullable(),
//   start_date: yup
//     .date()
//     .typeError("Invalid date")
//     .required("Select start date")
//     .when("access", {
//       is: 1,
//       otherwise: (d) =>
//         d
//           .min(today, "Should be today's date")
//           .max(today, "Should be today's date")
//     }),
//   end_date: yup
//     .date()
//     .typeError("Invalid date")
//     .required("Select end date")
//     .when("access", {
//       is: 1,
//       otherwise: (d) =>
//         d
//           .min(today, "Should be today's date")
//           .max(today, "Should be today's date")
//     })
// });

// function App() {
//   return (
//     <Container>
//       <Typography variant="h5">
//         Materail Ui Picker, Yup, and Formik Example{" "}
//       </Typography>
//       <Formik
//         initialValues={{
//           access: access ? access : 2,
//           start_date: today,
//           end_date: today
//         }}
//         validationSchema={validationSchema}
//         onSubmit={(values) => {
//           console.log(values);
//         }}
//       >
//         {({
//           values,
//           touched,
//           errors,
//           handleChange,
//           handleBlur,
//           handleSubmit,
//           setFieldValue
//         }) => (
//           <form onSubmit={handleSubmit}>
//             <Grid container direction="row" justify="center" spacing={2}>
//               <Grid item lg={6} md={6} xs={12}>
//                 <MuiPickersUtilsProvider utils={DateFnsUtils}>
//                   <KeyboardDatePicker
//                     minDate={access !== 1 ? new Date() : undefined}
//                     maxDate={access !== 1 ? new Date() : undefined}
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     inputVariant="outlined"
//                     id="date-picker-dialog"
//                     label="From"
//                     format="MM/dd/yyyy"
//                     value={values.start_date}
//                     onChange={(val) => {
//                       setFieldValue("start_date", val ? val : "");
//                     }}
//                     onBlur={handleBlur}
//                     helperText={touched.start_date ? errors.start_date : ""}
//                     error={touched.start_date && Boolean(errors.start_date)}
//                   />
//                 </MuiPickersUtilsProvider>
//               </Grid>

//               <Grid item lg={6} md={6} xs={12}>
//                 <MuiPickersUtilsProvider utils={DateFnsUtils}>
//                   <KeyboardDatePicker
//                     minDate={access !== 1 ? new Date() : undefined}
//                     maxDate={access !== 1 ? new Date() : undefined}
//                     fullWidth
//                     InputLabelProps={{ shrink: true }}
//                     inputVariant="outlined"
//                     id="date-picker-dialog"
//                     label="To"
//                     format="MM/dd/yyyy"
//                     value={values.end_date}
//                     onChange={(val) => {
//                       setFieldValue("end_date", val ? val : "");
//                     }}
//                     onBlur={handleBlur}
//                     helperText={touched.end_date ? errors.end_date : ""}
//                     error={touched.end_date && Boolean(errors.end_date)}
//                   />
//                 </MuiPickersUtilsProvider>
//               </Grid>
//             </Grid>
//             <Button
//               type="submit"
//               color="primary"
//               variant="contained"
//               size="small"
//             >
//               Submit
//             </Button>
//           </form>
//         )}
//       </Formik>
//     </Container>
//   );
// }

// const rootElement = document.getElementById("root");
// ReactDOM.render(<App />, rootElement);
