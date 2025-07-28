import { connect } from 'react-redux';
import { Form, Formik } from 'formik';
import { IoMdSend } from "react-icons/io";
import { sendMessage } from '../../../../store/slices/chatSlice';
import styles from './ChatInput.module.sass';
import FormInput from '../../../InputComponents/FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';

const ChatInput = (props) => {
  const submitHandler = (values, { resetForm }) => {
    props.sendMessage({
      messageBody: values.message,
      recipient: props.interlocutor.id,
      interlocutor: props.interlocutor,
    });
    resetForm();
  };

  return (
    <div className={styles.inputContainer}>
      <Formik
        onSubmit={submitHandler}
        initialValues={{ message: '' }}
        validationSchema={Schems.MessageSchema}
      >
        <Form className={styles.form}>
          <FormInput
            name="message"
            type="text"
            label="message"
            classes={{
              inputContainer: styles.container,
              input: styles.input,
              warning: styles.warning,
              notValid: styles.notValid,
            }}
          />
          <button type="submit">
            <IoMdSend />
          </button>
        </Form>
      </Formik>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { interlocutor } = state.chatStore;
  const { data } = state.userStore;
  return { interlocutor, data };
};

const mapDispatchToProps = (dispatch) => ({
  sendMessage: (data) => dispatch(sendMessage(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
