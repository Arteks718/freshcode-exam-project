import { useEffect } from 'react';
import { connect } from 'react-redux';
import { FaRegTimesCircle } from 'react-icons/fa';
import classNames from 'classnames';
import CONSTANTS from '../../../../constants';
import {
  changeTypeOfChatAdding,
  changeShowAddChatToCatalogMenu,
  getCatalogList,
} from '../../../../store/slices/chatSlice';
import styles from './CatalogCreation.module.sass';
import AddToCatalog from '../AddToCatalog/AddToCatalog';
import CreateCatalog from '../CreateCatalog/CreateCatalog';

const MODES = [
  {
    label: 'Old',
    value: CONSTANTS.ADD_CHAT_TO_OLD_CATALOG,
  },
  {
    label: 'New',
    value: CONSTANTS.CREATE_NEW_CATALOG_AND_ADD_CHAT,
  },
];

const CatalogCreation = (props) => {
  const {
    changeTypeOfChatAdding,
    catalogCreationMode,
    changeShowAddChatToCatalogMenu,
    isFetching,
    getCatalogList,
  } = props;

  useEffect(() => {
    getCatalogList();
  }, [getCatalogList]);

  return (
    <>
      {!isFetching && (
        <div className={styles.catalogCreationContainer}>
          <FaRegTimesCircle onClick={changeShowAddChatToCatalogMenu} />

          <div className={styles.buttonsContainer}>
            {MODES.map(({ label, value}) => (
              <span
                onClick={() => changeTypeOfChatAdding(value)}
                className={classNames({
                  [styles.active]:
                    catalogCreationMode=== value,
                })}
              >
                {label}
              </span>
            ))}
          </div>
          {catalogCreationMode === CONSTANTS.CREATE_NEW_CATALOG_AND_ADD_CHAT ? (
            <CreateCatalog />
          ) : (
            <AddToCatalog />
          )}
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state) => state.chatStore;

const mapDispatchToProps = (dispatch) => ({
  changeTypeOfChatAdding: (data) => dispatch(changeTypeOfChatAdding(data)),
  changeShowAddChatToCatalogMenu: () =>
    dispatch(changeShowAddChatToCatalogMenu()),
  getCatalogList: () => dispatch(getCatalogList()),
});

export default connect(mapStateToProps, mapDispatchToProps)(CatalogCreation);
