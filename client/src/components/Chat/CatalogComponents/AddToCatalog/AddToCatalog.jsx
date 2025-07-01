import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import SelectInput from '../../../SelectInput/SelectInput';
import { addChatToCatalog } from '../../../../store/slices/chatSlice';
import styles from './AddToCatalog.module.sass';

const AddToCatalog = (props) => {
  const { catalogList, addChatId, addChatToCatalog } = props;
  
  const getFilteredValues = () => {
    const array = catalogList.filter(
      (catalog) => !catalog.chats.find((c) => c.conversationId === addChatId)
    );
    return {
      ids: array.map((catalog) => catalog.id),
      names: array.map((catalog) => catalog.catalogName),
    };
  };

  const click = (values) =>
    addChatToCatalog({ chatId: addChatId, catalogId: values.catalogId });

  const filteredArray = getFilteredValues();
  return (
    <>
      {filteredArray.ids.length !== 0 ? (
        <Formik onSubmit={click} initialValues={{ catalogId: '' }}>
          <Form className={styles.form}>
            <SelectInput
              name="catalogId"
              header="Name of catalog"
              classes={{
                inputContainer: styles.selectInputContainer,
                inputHeader: styles.selectHeader,
                selectInput: styles.select,
              }}
              optionsArray={filteredArray.names}
              valueArray={filteredArray.ids}
            />
            <button type="submit">Add</button>
          </Form>
        </Formik>
      ) : (
        <div className={styles.notFound}>
          You have not created any directories.
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  addChatToCatalog: (data) => dispatch(addChatToCatalog(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddToCatalog);
