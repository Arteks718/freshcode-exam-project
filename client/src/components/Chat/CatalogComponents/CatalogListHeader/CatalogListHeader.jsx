import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form } from 'formik';
import {
  changeShowModeCatalog,
  changeRenameCatalogMode,
  changeCatalogName,
} from '../../../../store/slices/chatSlice';
import styles from './CatalogListHeader.module.sass';
import FormInput from '../../../InputComponents/FormInput/FormInput';
import Schems from '../../../../utils/validators/validationSchems';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

const CatalogListHeader = (props) => {
  const changeCatalogName = (values) => {
    const { changeCatalogName, id } = props;
    changeCatalogName({ catalogName: values.catalogName, catalogId: id });
  };
  
  const {
    catalogName,
    changeShowModeCatalog,
    changeRenameCatalogMode,
    isRenameCatalog,
    initialValues
  } = props;

  return (
    <div className={styles.headerContainer}>
      <FaArrowLeft alt="back" onClick={changeShowModeCatalog} />
      {isRenameCatalog ? (
        <div className={styles.changeContainer}>
          <Formik
            onSubmit={changeCatalogName}
            initialValues={initialValues}
            validationSchema={Schems.CatalogSchema}
          >
            <Form>
              <FormInput
                name="catalogName"
                classes={{
                  container: styles.inputContainer,
                  input: styles.input,
                  warning: styles.fieldWarning,
                  notValid: styles.notValid,
                }}
                type="text"
                label="Catalog Name"
              />
              <button type="submit">Change</button>
            </Form>
          </Formik>
        </div>
      ) : (
        <div className={styles.infoContainer}>
          <span>{catalogName}</span>
          <FaEdit onClick={changeRenameCatalogMode} />
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isRenameCatalog } = state.chatStore;
  const { catalogName, id } = state.chatStore.currentCatalog;
  return {
    id,
    catalogName,
    isRenameCatalog,
    initialValues: {
      catalogName,
    },
  };
};

const mapDispatchToProps = (dispatch) => ({
  changeShowModeCatalog: () => dispatch(changeShowModeCatalog()),
  changeRenameCatalogMode: () => dispatch(changeRenameCatalogMode()),
  changeCatalogName: (data) => dispatch(changeCatalogName(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogListHeader);
